import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "../../../../components/SiteHeader";
import { SiteFooter } from "../../../../components/SiteFooter";
import { CaseSpaceTabs } from "./CaseSpaceTabs";
import cases from "../../sample-cases.json";

type Case = Record<string, unknown>;
const all = cases as Case[];
const bookings = all.filter((c) => c.case_type === "BOOKING");

export function generateStaticParams() {
  return bookings.map((b) => ({ id: String(b.case_id) }));
}

export const metadata: Metadata = {
  title: "Booking CaseSpace | STAY · PublicLogic",
};

export default async function BookingDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = bookings.find((b) => b.case_id === id);
  if (!booking) notFound();

  const turnover = all.find((c) => c.case_id === booking.linked_turnover_case_id) ?? null;
  const status = String(booking.status);
  const statusTag = ["ACTIVE", "CONFIRMED", "DONE"].includes(status)
    ? "tag tag-green"
    : status === "BLOCKED" || status === "SOURCE_MISSING_REVIEW"
    ? "tag tag-red"
    : "tag";

  return (
    <>
      <SiteHeader />
      <main>
        <section className="section detail-head">
          <Link className="back-link" href="/stay">
            ← Back to dashboard
          </Link>
          <p className="eyebrow">CaseSpace detail</p>
          <div className="detail-title-row">
            <h1 className="page-title">{String(booking.guest_name ?? "Airbnb Guest")}</h1>
            <span className={statusTag}>{status}</span>
          </div>
          <p className="lede">
            Booking <code>{String(booking.case_id)}</code> · {String(booking.check_in_date)} →{" "}
            {String(booking.checkout_date)} · {String(booking.platform)}
          </p>
        </section>

        <CaseSpaceTabs booking={booking} turnover={turnover} />
      </main>
      <SiteFooter />
    </>
  );
}
