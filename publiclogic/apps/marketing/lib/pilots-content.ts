export type Pilot = {
  slug: string
  tag: string
  sub: string
  summary: string
  stat: string
  note: string
  detail: string[]
}

export const pilots: Pilot[] = [
  {
    slug: "small-contractor",
    tag: "Small Contractor",
    sub: "Electrician with 2 employees",
    summary:
      "Hours, materials, photos, and decisions in one job record — payroll-ready and invoice-ready without Friday-night reconstruction.",
    stat: "$10K/yr + 4 hrs/mo saved",
    note: "representative industry benchmark",
    detail: [
      "A two-person electrical contractor runs every job — from the first phone call to the final invoice — through a single CaseSpace. Techs log hours and materials from the field; photos and approvals attach to the same timeline.",
      "At closeout, the record freezes into a packet the owner can hand straight to their bookkeeper or an insurer, instead of reconstructing what happened from texts, a paper notebook, and memory.",
    ],
  },
  {
    slug: "town-hr",
    tag: "Town HR",
    sub: "Intake → onboarding → offboarding",
    summary:
      "One governed employee case from accepted offer to exit, coordinated across HR, payroll, IT, and supervisor.",
    stat: "~35% time savings",
    note: "representative public-sector benchmark",
    detail: [
      "A municipal HR office opens one CaseSpace the moment an offer is accepted. Payroll setup, IT provisioning, policy acknowledgements, and supervisor sign-off all post events to the same record instead of living in four inboxes.",
      "When the employee leaves, offboarding closes the same case — access revoked, equipment returned, exit interview logged — and the whole employment lifecycle is provable in one place.",
    ],
  },
  {
    slug: "cemetery-records",
    tag: "Cemetery Records",
    sub: "Unexpected proof",
    summary:
      "Burial request, deed, fees, scheduling, and permit on one timeline — where the record itself is the service.",
    stat: "Permanent retention",
    note: "the record should stay, provably",
    detail: [
      "Municipal cemetery records are some of the longest-lived records a town keeps — deeds, burial permits, and fee history that need to survive decades of staff turnover.",
      "PuddleJumper treats the record as the actual deliverable: every request, approval, and payment lands on an immutable timeline that a clerk today, or a records request twenty years from now, can verify.",
    ],
  },
]
