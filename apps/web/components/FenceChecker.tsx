'use client';

import { useState } from 'react';

type Answers = Record<number, string>;
type Phase = 'type' | 'fence' | 'fence-results' | 'coming-soon';

// ── Project types ─────────────────────────────────────────────────────────────

const PROJECT_TYPES = [
  { label: 'Fence',                    value: 'fence',         live: true  },
  { label: 'Deck or porch',            value: 'deck',          live: false },
  { label: 'Driveway or paving',       value: 'driveway',      live: false },
  { label: 'Shed or accessory structure', value: 'shed',       live: false },
  { label: 'Sign',                     value: 'sign',          live: false },
  { label: 'Change of use',            value: 'change-of-use', live: false },
  { label: 'Something else',           value: 'other',         live: false },
];

const PROJECT_LABELS: Record<string, string> = {
  deck:          'deck or porch',
  driveway:      'driveway or paving',
  shed:          'shed or accessory structure',
  sign:          'sign',
  'change-of-use': 'change of use',
  other:         'project',
};

// ── Fence questions & logic ───────────────────────────────────────────────────

const FENCE_QUESTIONS = [
  {
    id: 0,
    text: 'How tall is the fence?',
    options: ['Under 4 feet', '4–6 feet', '6–7 feet', 'Over 7 feet', 'Not sure yet'],
  },
  {
    id: 1,
    text: 'Is this fence next to or enclosing a pool?',
    options: ['Yes', 'No'],
  },
  {
    id: 2,
    text: 'Is the property in a historic district?',
    options: ['Yes', 'No', 'Not sure'],
  },
  {
    id: 3,
    text: 'Is the property within 100 feet of wetlands, a pond, a stream, or a river?',
    options: ['Yes — within 100 feet', 'Within 100–200 feet of a river or stream', 'No', 'Not sure'],
  },
  {
    id: 4,
    text: 'Is this a corner lot?',
    options: ['Yes', 'No', 'Not sure'],
  },
];

type Result = { type: 'permit' | 'flag' | 'clear'; title: string; detail: string };

function buildFenceResults(answers: Answers): Result[] {
  const results: Result[] = [];

  const height = answers[0];
  if (height === 'Over 7 feet') {
    results.push({ type: 'permit', title: 'Building permit required', detail: '780 CMR requires a building permit for fences over 7 feet. Your local zoning bylaw may set a stricter limit — confirm with your Building Department.' });
  } else if (height === '6–7 feet') {
    results.push({ type: 'flag', title: 'Permit likely required', detail: 'Most Massachusetts towns require a permit for fences at or above 6 feet under local zoning bylaws (MGL c.40A). Confirm with your Building Department before you start.' });
  } else if (height === 'Not sure yet') {
    results.push({ type: 'flag', title: 'Height determines permit status', detail: 'State building code (780 CMR) requires a permit above 7 feet. Local bylaws often kick in at 6 feet. Nail down your height before you apply.' });
  } else {
    results.push({ type: 'clear', title: 'Height: no state permit trigger', detail: `At ${height.toLowerCase()}, the state building code (780 CMR) doesn't require a permit. Your local zoning bylaw may still apply — worth a quick check.` });
  }

  if (answers[1] === 'Yes') {
    results.push({ type: 'permit', title: 'Pool barrier permit required', detail: '780 CMR requires permitted pool barriers: minimum 48 inches tall, with self-closing, self-latching gates on all sides. This permit is always required regardless of fence height.' });
  }

  if (answers[2] === 'Yes') {
    results.push({ type: 'permit', title: 'Certificate of Appropriateness required first', detail: 'MGL c.40C — before you apply for a building permit, you need a Certificate of Appropriateness from your local Historic District Commission. Plan for this step early; HDC review can take weeks.' });
  } else if (answers[2] === 'Not sure') {
    results.push({ type: 'flag', title: 'Check for historic district designation', detail: "If the property is in a local or national historic district, you'll need HDC approval before any permit. Check with your town or search MassGIS." });
  }

  const wetlands = answers[3];
  if (wetlands === 'Yes — within 100 feet') {
    results.push({ type: 'permit', title: 'Conservation Commission approval required', detail: 'MGL c.131 §40 and 310 CMR 10.00 — work within 100 feet of wetlands, ponds, or streams requires a Notice of Intent or Request for Determination of Applicability filed with your local ConCom before any other permit.' });
  } else if (wetlands === 'Within 100–200 feet of a river or stream') {
    results.push({ type: 'flag', title: 'Riverfront Area — ConCom review likely', detail: '310 CMR 10.00 extends the riverfront protection area to 200 feet from rivers and streams. File a Request for Determination of Applicability with your ConCom to confirm whether your project is within this zone.' });
  } else if (wetlands === 'Not sure') {
    results.push({ type: 'flag', title: 'Wetlands proximity: confirm before starting', detail: 'If there are any wetlands, water bodies, or streams within 200 feet, ConCom review may be required before any permits. Check the MassGIS wetlands layer or contact your Conservation Commission.' });
  }

  if (answers[4] === 'Yes') {
    results.push({ type: 'flag', title: 'Corner lot: sight-line check required', detail: 'Corner lots have visibility triangle requirements at intersections. Most local zoning bylaws restrict fence height and placement near corners for traffic safety. Confirm the setback rules with your Building Department.' });
  } else if (answers[4] === 'Not sure') {
    results.push({ type: 'flag', title: 'Confirm lot type', detail: 'If the property is on a corner, there may be sight-line restrictions. Worth a quick check before you finalize placement.' });
  }

  results.push({ type: 'flag', title: 'Local zoning: the variable layer', detail: "Massachusetts has 351 cities and towns, each with its own zoning bylaw (MGL c.40A). The results above are based on state law. Your town's bylaw may be stricter — check with your local Building Department to confirm the local rules." });

  return results;
}

// ── Shared result display ─────────────────────────────────────────────────────

function ResultList({ results, onReset }: { results: Result[]; onReset: () => void }) {
  const permits = results.filter((r) => r.type === 'permit');
  const flags   = results.filter((r) => r.type === 'flag');
  const clears  = results.filter((r) => r.type === 'clear');

  return (
    <div className="checker">
      <p className="checker-question" style={{ marginBottom: '.5rem' }}>Here&apos;s what your project needs.</p>
      <p style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        Based on your answers — Massachusetts state law. Your local bylaw may add requirements.
      </p>
      <div className="checker-result">
        {permits.length > 0 && (
          <>
            <p style={{ fontWeight: 900, fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--green)', margin: '0 0 .25rem' }}>Required</p>
            {permits.map((r, i) => (
              <div key={i} className="result-item result-permit">
                <strong>{r.title}</strong>
                <p>{r.detail}</p>
              </div>
            ))}
          </>
        )}
        {flags.length > 0 && (
          <>
            <p style={{ fontWeight: 900, fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--gold)', margin: '.75rem 0 .25rem' }}>Check these</p>
            {flags.map((r, i) => (
              <div key={i} className="result-item result-flag">
                <strong>{r.title}</strong>
                <p>{r.detail}</p>
              </div>
            ))}
          </>
        )}
        {clears.length > 0 && (
          <>
            <p style={{ fontWeight: 900, fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--muted)', margin: '.75rem 0 .25rem' }}>No state trigger</p>
            {clears.map((r, i) => (
              <div key={i} className="result-item result-clear">
                <strong>{r.title}</strong>
                <p>{r.detail}</p>
              </div>
            ))}
          </>
        )}
      </div>
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <a className="button primary" href="#stewardship">Get help carrying this →</a>
        <button className="checker-reset" onClick={onReset}>Check a different project</button>
      </div>
    </div>
  );
}

// ── Coming soon screen ────────────────────────────────────────────────────────

function ComingSoon({ projectType, onReset }: { projectType: string; onReset: () => void }) {
  const label = PROJECT_LABELS[projectType] ?? 'project';
  return (
    <div className="checker">
      <p className="checker-question" style={{ marginBottom: '.75rem' }}>
        We can still help with your {label}.
      </p>
      <p style={{ color: 'var(--muted)', fontSize: '.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
        The automated engine for this project type is in progress. In the meantime, a Quick Path Review gives you the same answer — we review your project, map the permit path, and hand you a clear checklist of what to file, in order, and with whom.
      </p>
      <div className="checker-result">
        <div className="result-item result-flag">
          <strong>What&apos;s coming</strong>
          <p>The {label} engine is being encoded now — the same approach as the fence vertical, with the full state rule set verified before it goes live.</p>
        </div>
        <div className="result-item result-permit">
          <strong>What you can do now</strong>
          <p>Start with a Quick Path Review ($250–500). Tell us what you&apos;re building — we&apos;ll confirm the permit path and give you the checklist. No guessing, no runaround.</p>
        </div>
      </div>
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <a className="button primary" href="/contact">Start a Quick Path Review →</a>
        <a className="button secondary" href="#stewardship">See Project Stewardship</a>
        <button className="checker-reset" onClick={onReset}>Check a different project</button>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function PermitChecker() {
  const [phase, setPhase]       = useState<Phase>('type');
  const [projectType, setType]  = useState('');
  const [step, setStep]         = useState(0);
  const [answers, setAnswers]   = useState<Answers>({});

  function reset() {
    setPhase('type');
    setType('');
    setStep(0);
    setAnswers({});
  }

  function selectType(value: string) {
    setType(value);
    if (value === 'fence') {
      setPhase('fence');
    } else {
      setPhase('coming-soon');
    }
  }

  function handleFenceAnswer(option: string) {
    const next = { ...answers, [step]: option };
    setAnswers(next);
    if (step < FENCE_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setPhase('fence-results');
    }
  }

  if (phase === 'fence-results') {
    return <ResultList results={buildFenceResults(answers)} onReset={reset} />;
  }

  if (phase === 'coming-soon') {
    return <ComingSoon projectType={projectType} onReset={reset} />;
  }

  if (phase === 'fence') {
    const q = FENCE_QUESTIONS[step];
    return (
      <div className="checker">
        <p className="checker-progress">Fence · Question {step + 1} of {FENCE_QUESTIONS.length}</p>
        <p className="checker-question">{q.text}</p>
        <div className="checker-options">
          {q.options.map((opt) => (
            <button key={opt} className="checker-option" onClick={() => handleFenceAnswer(opt)}>
              {opt}
            </button>
          ))}
        </div>
        {step > 0
          ? <button className="checker-back" onClick={() => setStep(step - 1)}>← Back</button>
          : <button className="checker-back" onClick={reset}>← Change project type</button>
        }
      </div>
    );
  }

  // phase === 'type'
  return (
    <div className="checker">
      <p className="checker-question">What type of project?</p>
      <div className="checker-options">
        {PROJECT_TYPES.map(({ label, value, live }) => (
          <button key={value} className="checker-option" onClick={() => selectType(value)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{label}</span>
            {live
              ? <span style={{ fontSize: '.75rem', fontWeight: 900, color: 'var(--green)', letterSpacing: '.06em' }}>LIVE</span>
              : <span style={{ fontSize: '.75rem', color: 'var(--muted)', letterSpacing: '.06em' }}>In progress</span>
            }
          </button>
        ))}
      </div>
    </div>
  );
}

// Keep old export name working during transition
export { PermitChecker as FenceChecker };
