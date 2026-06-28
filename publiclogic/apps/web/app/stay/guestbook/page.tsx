import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guestbook · Kendall Pond Lodge",
  description: "A calm house guide for your stay — essentials, house controls, rules, and a local guide.",
};

// STAY demo surface #3 (per the locked go-forward): Guestbook is VIEW-ONLY.
// The guest sees a calm house guide, not the machinery. Sample content — no PII.

const essentials = [
  { icon: "wifi", k: "Wi-Fi", v: "KendallPond-Guest — password is on the welcome card by the door." },
  { icon: "key", k: "Check-in / out", v: "Arrive after 4:00 PM · please depart by 11:00 AM." },
  { icon: "car", k: "Parking", v: "Two spots in the driveway. Please don’t block the turnaround." },
  { icon: "trash", k: "Trash & recycling", v: "Bins in the side shed. Curb pickup is Thursday morning." },
];

const controls = [
  { k: "Hot tub", v: "On the back deck. Slide the cover off, jets are on the side panel. Please replace the cover when you’re done." },
  { k: "Thermostat", v: "In the hallway. Comfortable range is 60–72°F — please don’t go higher." },
  { k: "Fireplace", v: "Gas, switch on the mantel. Hold three seconds to light." },
  { k: "Coffee", v: "Drip maker and a starter set of grounds and filters are in the left cabinet." },
];

const rules = [
  "Quiet hours 10:00 PM – 8:00 AM — sound carries across the pond.",
  "No smoking indoors. Please use the deck and the ashtray provided.",
  "Pets by prior arrangement only.",
  "Max 8 guests; the lodge sleeps 6 comfortably.",
];

const local = [
  { k: "Town", v: "10 minutes — general store, pharmacy, gas." },
  { k: "Trailhead", v: "5 minutes — the pond loop is 2.4 miles, easy." },
  { k: "Groceries", v: "12 minutes — full market, opens 7 AM." },
  { k: "Emergency", v: "Dial 911. Nearest hospital is 20 minutes." },
];

export default function Guestbook() {
  return (
    <div className="guest-shell">
      <header className="guest-bar">
        <span className="brand">
          <span className="brand-mark" aria-hidden="true" />
          Kendall Pond Lodge
        </span>
        <span className="pill-soft">Guest guide</span>
      </header>

      <main className="guest-main">
        <section className="guide-hero">
          <p className="eyebrow">Welcome</p>
          <h1 className="page-title">Make yourself at home.</h1>
          <p className="lede">
            Everything you need for a calm stay — the essentials, how the house works, a few house
            rules, and what’s nearby. No apps, no logins.
          </p>
        </section>

        <section className="guide-section">
          <h2>The essentials</h2>
          <div className="grid grid-2">
            {essentials.map((e) => (
              <article key={e.k} className="card">
                <h3>{e.k}</h3>
                <p>{e.v}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="guide-section">
          <h2>How the house works</h2>
          <ul className="list">
            {controls.map((c) => (
              <li key={c.k}>
                <strong>{c.k}</strong>
                <span>{c.v}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="guide-section">
          <h2>House rules</h2>
          <ul className="rule-list">
            {rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        <section className="guide-section">
          <h2>Around the pond</h2>
          <div className="grid grid-2">
            {local.map((l) => (
              <article key={l.k} className="card">
                <h3>{l.k}</h3>
                <p>{l.v}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="guide-section">
          <div className="panel guide-host">
            <h2>Questions?</h2>
            <p className="lede">Your host is a message away. We hope you love it here.</p>
          </div>
        </section>
      </main>

      <footer className="guest-foot">
        <span>Kendall Pond Lodge</span>
        <Link href="/stay">Operator view →</Link>
      </footer>
    </div>
  );
}
