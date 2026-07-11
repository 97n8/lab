import { loadDashboard } from "../lib/dashboard";
import { loadTransactions } from "../lib/transactions";
import { StayApp } from "./StayApp";

// Read data/kpl/*.json|.csv fresh on every request rather than baking whatever
// was on disk at build time into a static page — `npm run kpl:sync` should be
// visible on the next reload, not the next deploy.
export const dynamic = "force-dynamic";

export default async function Page() {
  const [{ dashboard, live: dashboardLive }, { reservations, totals, monthly, live: transactionsLive }] =
    await Promise.all([loadDashboard(), loadTransactions()]);

  return (
    <StayApp
      dashboard={dashboard}
      dashboardLive={dashboardLive}
      reservations={reservations}
      totals={totals}
      monthly={monthly}
      transactionsLive={transactionsLive}
    />
  );
}
