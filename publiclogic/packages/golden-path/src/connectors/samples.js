// Sample connectors — local proof that the contract is source-agnostic. Each one
// only implements its two source-specific edges (receive, normalize); resolve and
// receipt come from the core. The Airbnb connector deliberately mirrors the KPL
// reservation shape, so "the interface supports KPL today" is demonstrable, not
// asserted. These are fixtures, not the product — no Drive/MCP, no network.

import { defineConnector, toSignal, toPJObject } from "../connector.js";

// ---- Gmail-like: a guest message ------------------------------------------
export const gmailConnector = defineConnector({
  source: "gmail",
  async receive(input) {
    return toSignal({
      source: "gmail",
      signalType: "message.received",
      sourceId: input.messageId,
      occurredAt: input.receivedAt,
      actor: input.from,
      payload: { subject: input.subject, body: input.body, threadHint: input.threadHint ?? null },
    });
  },
  async normalize(signal) {
    return toPJObject({
      objectType: "stay.message",
      title: signal.payload.subject,
      summary: String(signal.payload.body).slice(0, 140),
      relatedPeople: [signal.actor],
      suggestedCaseSpace: signal.payload.threadHint ?? null,
      confidence: 0.9,
      metadata: { source: "gmail", signalType: signal.signalType },
    });
  },
});

// ---- Airbnb-like: a reservation (KPL shape) --------------------------------
export const airbnbConnector = defineConnector({
  source: "airbnb",
  async receive(input) {
    return toSignal({
      source: "airbnb",
      signalType: "reservation.created",
      sourceId: input.reservationCode,
      occurredAt: input.createdAt,
      actor: input.guest,
      payload: { listing: input.listing, checkIn: input.checkIn, checkout: input.checkout, status: input.status },
    });
  },
  async normalize(signal) {
    const { listing, checkIn, checkout } = signal.payload;
    return toPJObject({
      objectType: "stay.reservation",
      title: `Reservation ${checkIn} → ${checkout}`,
      summary: `${listing}: ${signal.actor}`,
      relatedPeople: [signal.actor],
      relatedDates: [checkIn, checkout],
      suggestedCaseSpace: `stay:${listing}:${checkIn}`,
      confidence: 0.96,
      metadata: { source: "airbnb", signalType: signal.signalType, status: signal.payload.status },
    });
  },
});

// ---- File-upload / Drive-like: a document ---------------------------------
export const fileConnector = defineConnector({
  source: "drive",
  async receive(input) {
    return toSignal({
      source: "drive",
      signalType: "file.uploaded",
      sourceId: input.fileId,
      occurredAt: input.uploadedAt,
      actor: input.uploadedBy,
      payload: { name: input.name, mime: input.mime, size: input.size, caseHint: input.caseHint ?? null },
    });
  },
  async normalize(signal) {
    return toPJObject({
      objectType: "muni.document",
      title: signal.payload.name,
      relatedFiles: [signal.payload.name],
      relatedPeople: signal.actor ? [signal.actor] : [],
      suggestedCaseSpace: signal.payload.caseHint ?? null,
      confidence: 0.72,
      metadata: { source: "drive", signalType: signal.signalType, mime: signal.payload.mime, size: signal.payload.size },
    });
  },
});

export const SAMPLE_CONNECTORS = { gmail: gmailConnector, airbnb: airbnbConnector, drive: fileConnector };

// Raw inbound fixtures, exactly as a source would hand them over.
export const SAMPLE_INPUTS = {
  gmail: {
    connector: "gmail",
    input: {
      messageId: "gmail-msg-7781",
      from: "guest.martin@example.com",
      subject: "Check-in question",
      body: "Hi — what time can we check in on July 3rd? Travelling with a dog.",
      receivedAt: "2026-06-28T14:30:00Z",
      threadHint: null, // no known thread → resolver should OPEN
    },
  },
  airbnb: {
    connector: "airbnb",
    input: {
      reservationCode: "HMABCD1234",
      guest: "guest.martin@example.com",
      listing: "Kendall Pond Lodge",
      checkIn: "2026-07-03",
      checkout: "2026-07-07",
      status: "confirmed",
      createdAt: "2026-06-20T09:15:00Z",
    },
  },
  drive: {
    connector: "drive",
    input: {
      fileId: "drive-file-9z",
      name: "Signed Rental Agreement.pdf",
      mime: "application/pdf",
      size: 184233,
      uploadedBy: "ops@kendallpond.example",
      uploadedAt: "2026-06-28T16:05:00Z",
      caseHint: "stay:Kendall Pond Lodge:2026-07-03", // matches the reservation's CaseSpace → APPEND
    },
  },
};
