import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

const SERVICES = [
  {
    n: "01",
    h: "Governance & program support",
    p: "Clarify roles, decisions, obligations, and the operating structure around work that crosses people or organizations.",
    outputs: "Operating map · role matrix · decision path · 90-day roadmap",
  },
  {
    n: "02",
    h: "Grants & funding",
    p: "Turn an opportunity into a fundable, manageable path—from readiness and partner roles through submission and implementation.",
    outputs: "Funding scan · grant calendar · readiness packet · implementation plan",
  },
  {
    n: "03",
    h: "Permit & Bridge",
    p: "Help a project understand what approvals may apply, what has to happen first, and how to carry the paper trail through closeout.",
    outputs: "Permit path · requirement checklist · submission packet · closeout record",
  },
  {
    n: "04",
    h: "Documentation & continuity",
    p: "Build the guides, registers, records, training, and handoffs that let the next person pick up the work without starting over.",
    outputs: "Operating guide · evidence register · training tools · handoff record",
  },
];

const WORK = [
  {
    tag: "Municipal leadership",
    h: "A first-90-days operating framework",
    p: "A board-ready path from listening and inventory through baseline findings, priorities, and a roadmap the next person can continue.",
  },
  {
    tag: "Funding & implementation",
    h: "A multi-partner readiness package",
    p: "Roles, funding opportunities, project facts, milestones, risks, and the documents needed to move a complex initiative forward.",
  },
  {
    tag: "Public process",
    h: "A permit and approval path",
    p: "One clear picture of likely reviews, missing information, sequencing, decision points, and the record that should survive the project.",
  },
];

const METHOD = [
  { n: "01", h: "Map reality", p: "See what is active, who carries it, where it breaks, and what must survive." },
  { n: "02", h: "Build structure", p: "Make roles, records, decisions, deadlines, and handoffs clear enough to use." },
  { n: "03", h: "Work it together", p: "Put the structure into the real environment and help people make it their own." },
  { n: "04", h: "Carry it forward", p: "Close with proof, practical guidance, and a stronger starting point for the next cycle." },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="cover-hero">
          <div className="cover-grid">
            <div className="cover-copy">
              <p className="cover-kicker">PublicLogic · Systems for Continuity</p>
              <span className="cover-rule" aria-hidden="true" />
              <h1>Make the work hold together.</h1>
              <p className="cover-lede">
                PublicLogic helps public organizations and complex projects turn scattered
                responsibilities, records, deadlines, and decisions into systems people can
                actually run.
              </p>
              <div className="actions">
                <Link className="button cover-primary" href="/contact">Start with a Systems Scan</Link>
                <Link className="button cover-secondary" href="/work">See selected work</Link>
              </div>
            </div>
            <aside className="brief-card">
              <p className="brief-label">What we carry</p>
              {[
                "Governance and program support",
                "Grants and funding",
                "Permitting and approvals",
                "Documentation and records",
                "Training and continuity",
              ].map((item) => (
                <div className="brief-row" key={item}><span>—</span><strong>{item}</strong></div>
              ))}
              <p className="brief-foot">The institution owns what we build.</p>
            </aside>
          </div>
        </section>

        <section className="trust-strip" aria-label="PublicLogic commitments">
          <p>We do not create dependency. We create understanding.</p>
          <p>Human judgment stays with the people responsible.</p>
          <p>The next person should have a better place to start.</p>
        </section>

        <section className="civic-picture-grid" aria-label="Public work in Massachusetts">
          <figure className="civic-picture civic-picture-wide">
            <Image
              src="/images/community-meeting.jpg"
              alt="A large Massachusetts community meeting in a school gymnasium"
              fill
              sizes="(max-width: 900px) 100vw, 66vw"
              priority
            />
            <figcaption>
              <span>Public work is lived work</span>
              Decisions have to hold across rooms, records, responsibilities, and time.
            </figcaption>
          </figure>
          <figure className="civic-picture civic-picture-tall">
            <Image
              src="/images/wellesley-town-hall.jpg"
              alt="Historic Wellesley Town Hall in Massachusetts"
              fill
              sizes="(max-width: 900px) 100vw, 34vw"
            />
            <figcaption>
              <span>Institutions outlast assignments</span>
              Wellesley Town Hall, Massachusetts.{" "}
              <a href="https://www.loc.gov/item/ma1369/" target="_blank" rel="noreferrer">
                Library of Congress
              </a>
            </figcaption>
          </figure>
        </section>

        <section className="section editorial-intro">
          <div>
            <p className="eyebrow">The work beneath the work</p>
            <h2>Good work gets fragile when the structure lives in one person’s head.</h2>
          </div>
          <div>
            <p>
              Organizations rarely lack effort. They lose continuity when ownership is unclear,
              requirements are scattered, decisions disappear into email, and every transition
              forces someone to rebuild the story.
            </p>
            <p>
              PublicLogic makes that structure visible, usable, and transferable—without asking
              people to abandon every tool they already know.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">What PublicLogic does</p>
            <h2>Serious support for work that crosses boundaries.</h2>
            <p>Bring us the process, project, or program that has too many moving parts and too little shared structure.</p>
          </div>
          <div className="service-ledger">
            {SERVICES.map((service) => (
              <article key={service.n}>
                <span>{service.n}</span>
                <div>
                  <h3>{service.h}</h3>
                  <p>{service.p}</p>
                </div>
                <p className="ledger-output">{service.outputs}</p>
              </article>
            ))}
          </div>
          <Link className="text-link" href="/services">See services and deliverables <span>→</span></Link>
        </section>

        <section className="permit-feature">
          <div>
            <p className="eyebrow">Permit &amp; Bridge</p>
            <h2>Can you do this?</h2>
            <p>
              A project can stall before it starts because requirements live across departments,
              bylaws, agencies, and timelines that do not talk to each other. We turn that scattered
              process into a path you can act on.
            </p>
            <div className="actions">
              <Link className="button primary" href="/permit-bridge">Check the path</Link>
              <Link className="button secondary" href="/contact">Talk through a project</Link>
            </div>
          </div>
          <div className="permit-path" aria-label="Permit and Bridge path">
            {["Project facts", "Likely reviews", "Missing items", "Sequence & owners", "Submission & closeout"].map((item, i) => (
              <div key={item}><span>{String(i + 1).padStart(2, "0")}</span><strong>{item}</strong></div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">Selected work</p>
            <h2>The deliverable should help someone move.</h2>
            <p>Representative, anonymized examples of the work PublicLogic builds and leaves behind.</p>
          </div>
          <div className="work-grid">
            {WORK.map((item) => (
              <article key={item.h}>
                <span>{item.tag}</span>
                <h3>{item.h}</h3>
                <p>{item.p}</p>
              </article>
            ))}
          </div>
          <Link className="text-link" href="/work">See more selected work <span>→</span></Link>
        </section>

        <section className="method-band">
          <div className="method-heading">
            <p className="eyebrow">The PublicLogic method</p>
            <h2>Could the next person pick this up cold?</h2>
            <p>
              That is the operating test. Not whether a folder exists—whether someone new can
              understand what is live, what comes next, what was decided, and what proves it.
            </p>
          </div>
          <div className="method-grid">
            {METHOD.map((step) => (
              <article key={step.n}>
                <span>{step.n}</span>
                <h3>{step.h}</h3>
                <p>{step.p}</p>
              </article>
            ))}
          </div>
          <Link className="button method-button" href="/method">Read the method</Link>
        </section>

        <section className="section team-feature">
          <div className="team-picture">
            <Image
              src="/images/nathan-boudreau.jpg"
              alt="Nathan Boudreau working at a public event"
              width={902}
              height={1200}
              sizes="(max-width: 900px) 100vw, 40vw"
            />
          </div>
          <div className="team-copy">
            <p className="eyebrow">Two disciplines. One operating test.</p>
            <h2>Public practice meets organizational psychology.</h2>
            <p>
              Nathan Boudreau brings fifteen years inside Massachusetts municipal government:
              governance, administration, procurement, records, grants, and implementation.
            </p>
            <p>
              Dr. Allison Weiss Rothschild brings organizational psychology, behavioral systems,
              training, adoption, leadership, and institutions stewardship.
            </p>
            <p><strong>Together, they build systems that are sound on paper and workable for the people who have to carry them.</strong></p>
            <Link className="text-link" href="/about">Meet PublicLogic <span>→</span></Link>
          </div>
        </section>

        <section className="scan-band" id="systems-scan">
          <div className="scan-heading">
            <p className="eyebrow">A bounded first engagement</p>
            <h2>Start with a Systems Scan.</h2>
            <p>
              Before prescribing a platform, program, or large engagement, we build one useful
              picture of the work as it exists now.
            </p>
          </div>
          <div className="scan-grid">
            <article>
              <span>01</span>
              <h3>See the whole picture</h3>
              <p>Active work, obligations, people, records, deadlines, tools, and pressure points.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Name what is fragile</h3>
              <p>Where ownership blurs, proof disappears, handoffs fail, or one person carries too much.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Leave with a next-step brief</h3>
              <p>A practical map of priorities, owners, immediate moves, and what should happen next.</p>
            </article>
          </div>
          <div className="scan-close">
            <p>Scope, timing, and fee are agreed before the scan begins. The work belongs to you when it is done.</p>
            <Link className="button scan-button" href="/contact?work=Not%20sure%20yet">Describe the work</Link>
          </div>
        </section>

        <section className="pj-note">
          <div>
            <p className="eyebrow">PuddleJumper</p>
            <h2>The quiet structure underneath.</h2>
          </div>
          <div>
            <p>
              PublicLogic uses PuddleJumper, our runtime, to help roles stay visible, approvals
              happen before action, and the working record carry forward. It supports the
              stewardship. It does not replace it.
            </p>
            <Link className="text-link" href="/pj">See what is working now <span>→</span></Link>
          </div>
        </section>

        <section className="section">
          <div className="final-cta">
            <p className="eyebrow">Start with the real work</p>
            <h2>What needs to hold together?</h2>
            <p>You do not need to know the right product. Tell us what is active, stuck, scattered, or being carried by one person.</p>
            <Link className="button primary" href="/contact?work=Not%20sure%20yet">Start a conversation</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
