declare module "@publiclogic/golden-path" {
  export const SEED_TYPES: { type: string; label: string; placeholder: string }[];
  export const PIPELINE: string[];
  export const ASSET_TYPES: string[];
  export const DOCUMENT_FOLDERS: string[];
  export const CASESPACE_TABS: string[];
  export const GOVERNED_OBJECTS: string[];
  export function canAttach(kind: string): boolean;
  export function shortHash(input: string): string;
  // Compiled result is a plain object graph; typed loosely on purpose.
  export function compileSeed(
    seed: { type: string; value?: string },
    opts?: { timestamp?: string }
  ): {
    seed: { type: string; value: string };
    source_profile: Record<string, unknown>;
    asset_set: { id: string; types: { type: string; count: number; suggested: boolean }[] };
    document_set: { id: string; folders: { folder: string }[] };
    casespace: { id: string; tabs: string[]; source_profile_id: string };
  };

  export const LOCKED_LANES: string[];
  export const FORM_FIELDS: {
    key: string;
    label: string;
    kind: string;
    required?: boolean;
    grounded?: boolean;
    placeholder?: string;
  }[];
  export function deriveFormDefaults(identity: unknown): Record<string, string>;
  export type FormReceipt = {
    object: string;
    canonical_form_version: string;
    object_hash: string;
    object_type: string;
    object_id: string;
    at: string | null;
  };
  export function submitForm(
    identity: unknown,
    answers?: Record<string, string>,
    opts?: { timestamp?: string }
  ): Promise<{
    valid: boolean;
    missing: string[];
    form_entry: Record<string, unknown> & { id: string };
    receipt: FormReceipt | null;
    casespace: Record<string, unknown> & { tabs_content: Record<string, unknown> };
    prr: { seq: number; at: string | null; kind: string; event: string; by: string; ref: string | null }[];
  }>;
  export function openForm(
    identity: unknown,
    answers?: Record<string, string>,
    opts?: { timestamp?: string }
  ): {
    valid: boolean;
    missing: string[];
    form_entry: Record<string, unknown>;
    casespace: Record<string, unknown> & { tabs_content: Record<string, unknown> };
    prr: { seq: number; at: string | null; event: string; by: string }[];
  };

  // GP-004 — PRR recordstream
  export const PRR_KINDS: string[];
  export type PrrEntry = { seq: number; at: string | null; kind: string; event: string; by: string; ref: string | null };
  export type Evidence = { id: string; item: string; owner: string; status: string };
  export type Punch = { type: string; who: string; at: string | null };
  export type Runtime = {
    casespace: Record<string, unknown>;
    form_entry: Record<string, unknown>;
    prr: PrrEntry[];
    evidence: Evidence[];
    decisions: { id: string; decision: string; basis: string; by: string }[];
    checks: { object: string; ready?: boolean; missing?: string[]; allowed?: boolean }[];
    punches?: Punch[];
  };
  export function appendPRR(stream: PrrEntry[], entry: Partial<PrrEntry>, opts?: { timestamp?: string }): PrrEntry[];
  export function openRuntime(identity: unknown, answers?: Record<string, string>, opts?: { timestamp?: string }): Runtime;
  export function requestEvidence(rt: Runtime, p: { item: string; owner?: string; by?: string }, opts?: { timestamp?: string }): Runtime;
  export function provideEvidence(rt: Runtime, p: { evidenceId: string; by?: string }, opts?: { timestamp?: string }): Runtime;
  export function logDecision(rt: Runtime, p: { decision: string; basis?: string; by?: string }, opts?: { timestamp?: string }): Runtime;
  export function runCAL(rt: Runtime, p: { action: string; actor: string; allowed: boolean; reason?: string }, opts?: { timestamp?: string }): Runtime;
  export function runPRM(rt: Runtime, p?: { milestone?: string; by?: string }, opts?: { timestamp?: string }): Runtime;
  export function recordNote(rt: Runtime, p: { event: string; by?: string }, opts?: { timestamp?: string }): Runtime;
  export const PUNCH_LABELS: Record<string, string>;
  export function punch(rt: Runtime, p: { type: string; who?: string; at?: string }, opts?: { timestamp?: string }): Runtime;
  export function computeHours(punches: { type: string; at: string | null }[]): number;

  // Canonical Form v1 + Record Receipts
  export const CANONICAL_FORM_VERSION: string;
  export function canonicalize(value: unknown): string;
  export function sha256Hex(text: string): Promise<string>;
  export function hashCanonical(value: unknown): Promise<string>;
  export function makeReceipt(object: unknown, meta?: Record<string, unknown>): Promise<Record<string, unknown>>;
  export function verifyReceipt(object: unknown, receipt: Record<string, unknown> | null): Promise<boolean>;

  // Packet Builder — seal + offline verification
  export type RecordReceipt = { object: string; canonical_form_version: string; seq: number; object_hash: string };
  export type PacketItem = { seq: number; record: Record<string, unknown>; receipt: RecordReceipt };
  export type CaseReceipt = {
    object: string;
    canonical_form_version: string;
    casespace: Record<string, unknown>;
    record_count: number;
    merkle_root: string;
    receipt_hash: string;
    [k: string]: unknown;
  };
  export type Packet = { object: string; canonical_form_version: string; case_receipt: CaseReceipt; items: PacketItem[] };
  export type Verdict = { ok: boolean; failures: string[]; merkle_root?: string };
  export function merkleRoot(objectHashes: string[]): Promise<string>;
  export function buildPacket(caseRef: Record<string, unknown>, records: unknown[], meta?: Record<string, unknown>): Promise<Packet>;
  export function verifyPacket(packet: Packet | null): Promise<Verdict>;
}
