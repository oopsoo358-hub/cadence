import { useState } from 'react'
import { CtaBand, PageHero, SectionHead, Slate } from '../components/bits'
import {
  ActiveCall,
  AlertSheet,
  CallBackScreen,
  ConsentScreen,
  ContactsScreen,
  DecideScreen,
  LockScreen,
  MessagesScreen,
  NotesScreen,
  PauseScreen,
  Phone,
  RecentsScreen,
  SettingsScreen,
  VerifyScreen,
} from '../components/devices'
import { HRail, Reveal, Scene, ScrubType, Shot, StepScene, vars, type StepDef } from '../components/motion'
import { useReducedMotion } from '../lib/scrub'

// ---------------------------------------------------------------------------
// The four steps. Each step owns a quarter of the scene; the phone plays through
// the screens that belong to it.
// ---------------------------------------------------------------------------

const STEPS: StepDef[] = [
  {
    key: 'Notice',
    time: 'During the call',
    title: 'Notice the voice and the pressure.',
    body: 'With your consent, Cadence listens for audio patterns that can appear in generated or altered speech, and for the tactics that travel with them: urgency, secrecy, unusual payment requests.',
    aside: 'Signal, not certainty',
    screen: (
      <ActiveCall
        strip="listening"
        time="00:11"
        captions={<ScrubType text="Mum? It’s me. I’m in trouble. Please don’t tell Dad. I need money, right now." a={0.02} b={0.21} />}
      />
    ),
  },
  {
    key: 'Pause',
    time: 'The next 90 seconds',
    title: 'Make room for doubt.',
    body: 'If a call raises a flag you get a calm prompt, never a siren. It asks you to breathe and hold off on money or private details. Real emergencies survive a ninety-second pause.',
    aside: 'No panic buttons',
    screen: (
      <>
        <Shot a={-1} b={0.43} f={0.03} style={vars({ '--s': 'clamp(0, calc((var(--p) - 0.26) / 0.1), 1)' })}>
          <AlertSheet />
        </Shot>
        <Shot a={0.39} b={2} f={0.03} style={vars({ '--cd': 'calc(0.04 + 0.3 * clamp(0, calc((var(--p) - 0.41) / 0.09), 1))' })}>
          <PauseScreen />
        </Shot>
      </>
    ),
  },
  {
    key: 'Verify',
    time: 'Your channel, your choice',
    title: 'Verify in a way only you can.',
    body: 'Hang up and call back on a number you already trust, ask for the family safe word, or check with someone close to them. A cloned voice can’t answer a question only the real person can.',
    aside: 'You stay in control',
    screen: (
      <>
        <Shot a={-1} b={0.6} f={0.03}>
          <VerifyScreen />
        </Shot>
        <Shot a={0.57} b={0.7} f={0.03}>
          <VerifyScreen pick={0} />
        </Shot>
        <Shot a={0.67} b={2} f={0.03}>
          <CallBackScreen />
        </Shot>
      </>
    ),
  },
  {
    key: 'Decide',
    time: 'Whenever you’re ready',
    title: 'Decide, and move on calmly.',
    body: 'Whatever you find out, the next move is yours. If it wasn’t them, Cadence points you to the people to tell, and helps you talk it through if you want to.',
    aside: 'Never a verdict',
    screen: <DecideScreen />,
  },
]

function Sequence() {
  return (
    <StepScene
      steps={STEPS}
      length={420}
      label="The four steps"
      chapter="The four steps"
      kicker={<Slate index="Sequence">Four steps</Slate>}
    />
  )
}

// ---------------------------------------------------------------------------
// "Signal, not certainty": a fader that moves the reading. The phone shows what
// Cadence would say, and what never changes is the advice to verify.
// ---------------------------------------------------------------------------

const ZONES = [
  {
    max: 30,
    id: 'quiet',
    label: 'No strong synthetic signal',
    copy: 'That is one useful signal, not proof of who is calling. If they are asking for money or secrecy, verify anyway.',
  },
  {
    max: 65,
    id: 'mixed',
    label: 'Mixed signals',
    copy: 'Something may be off, or the line may simply be poor. Slow down and confirm on another channel before you act.',
  },
  {
    max: 100,
    id: 'alert',
    label: 'Needs a second look',
    copy: 'Pause before sharing money or private details. Hang up and call the person back on a number you already trust.',
  },
] as const

const CAPTION = '“I need money. Right now. Don’t tell anyone.”'

function ZoneScreen({ zone }: { zone: (typeof ZONES)[number]['id'] }) {
  if (zone === 'alert') return <AlertSheet />
  if (zone === 'mixed') return <ActiveCall strip="listening" stripLabel="Mixed signals" time="00:38" captions={CAPTION} />
  return <ActiveCall strip="quiet" time="00:38" captions={CAPTION} />
}

function Certainty() {
  const [level, setLevel] = useState(22)
  const zone = ZONES.find((z) => level <= z.max) ?? ZONES[2]

  return (
    <section className="certainty" data-tone="paper" data-chapter="Signal, not certainty" aria-labelledby="certainty-title">
      <div className="wrap certainty-grid">
        <div className="certainty-copy">
          <SectionHead
            index="Try it"
            label="Signal, not certainty"
            title={<span id="certainty-title">Whatever the reading, the rule is the same.</span>}
            lead="Move the fader to see how Cadence would speak at different signal strengths. Notice what never changes: urgent money requests get verified."
          />
          <Reveal delay={100} className="fader">
            <label className="fader-label" htmlFor="signal-range">
              How strong is the voice pattern?
            </label>
            <div className="fader-rail">
              <div className="fader-scale" aria-hidden="true">
                {Array.from({ length: 21 }, (_, i) => (
                  <i key={i} className={i % 5 === 0 ? 'is-major' : undefined} />
                ))}
              </div>
              <input
                id="signal-range"
                type="range"
                min={0}
                max={100}
                value={level}
                style={vars({ '--v': level })}
                onChange={(e) => setLevel(Number(e.target.value))}
                aria-valuetext={zone.label}
              />
            </div>
            <div className="fader-zones" aria-hidden="true">
              <span className={zone.id === 'quiet' ? 'is-on' : undefined}>Weak</span>
              <span className={zone.id === 'mixed' ? 'is-on' : undefined}>Mixed</span>
              <span className={zone.id === 'alert' ? 'is-on' : undefined}>Strong</span>
            </div>
            <div className="fader-result" aria-live="polite">
              <p className="fader-state">{zone.label}</p>
              <p>{zone.copy}</p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={150} className="certainty-phone">
          <Phone width="min(320px, 76vw)">
            <div key={zone.id} className="phone-swap">
              <ZoneScreen zone={zone.id} />
            </div>
          </Phone>
        </Reveal>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Anatomy of an alert: a spotlight walks across the real alert sheet.
// ---------------------------------------------------------------------------

const ANATOMY = [
  { n: 'I', title: 'A plain-language reason.', body: 'What was noticed, without jargon or scores.' },
  { n: 'II', title: 'One suggested next step.', body: 'Usually: hang up and call back on a number you trust.' },
  { n: 'III', title: 'An easy way out.', body: 'Dismiss it any time. It is advice, never a block.' },
]

function Anatomy() {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <section className="anat-static" data-tone="ink" data-chapter="Anatomy of an alert" aria-labelledby="anat-title-static">
        <div className="wrap anat-static-grid">
          <div>
            <SectionHead
              index="Preview"
              label="Anatomy of an alert"
              title={<span id="anat-title-static">Clear, kind and easy to dismiss.</span>}
              lead="An alert should lower your heart rate, not raise it. Every one is built from the same three parts."
            />
            <ol className="anat-list">
              {ANATOMY.map((a) => (
                <li key={a.n}>
                  <span>{a.n}</span>
                  <div>
                    <b>{a.title}</b> {a.body}
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <Phone width="min(320px, 80vw)">
            <AlertSheet />
          </Phone>
        </div>
      </section>
    )
  }

  return (
    <Scene steps={3} length={300} tone="ink" className="anat" label="Anatomy of an alert" chapter="Anatomy of an alert">
      <div className="wrap anat-grid">
        <div className="anat-left">
          <Slate index="Preview">Anatomy of an alert</Slate>
          <h2 className="display section-title">
            Clear, kind and <em>easy to dismiss.</em>
          </h2>
          <p className="lead">An alert should lower your heart rate, not raise it. Every one is built from the same three parts.</p>
          <ol className="anat-list">
            {ANATOMY.map((a, i) => (
              <li key={a.n} style={vars({ '--i': i })}>
                <span>{a.n}</span>
                <div>
                  <b>{a.title}</b>
                  <p>{a.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="anat-right">
          <Phone width="var(--stage-phone)">
            <AlertSheet />
            <div className="anat-spot" />
          </Phone>
        </div>
      </div>
    </Scene>
  )
}

// ---------------------------------------------------------------------------
// Every screen: the whole interface on a horizontal strip.
// ---------------------------------------------------------------------------

const GALLERY = [
  { name: 'The nudge', copy: 'A quiet notification on the lock screen when a call shows signs common to voice-clone scams.', screen: <LockScreen /> },
  { name: 'Consent first', copy: 'Before Cadence listens to a call, it asks. Every call, every time.', screen: <ConsentScreen /> },
  { name: 'The call log', copy: 'Calls that got a second look are marked, and so are the ones you verified.', screen: <RecentsScreen /> },
  {
    name: 'Tell someone',
    copy: 'The family group is one tap away, because these scams depend on you staying quiet.',
    screen: (
      <MessagesScreen
        messages={[
          { from: 'me', text: 'Someone just called sounding exactly like Aarav, asking for money.' },
          { from: 'them', who: 'Papa', text: 'Don’t send anything. Call me.' },
        ]}
      />
    ),
  },
  { name: 'Your safe word', copy: 'Kept in a locked note, where only you can see it.', screen: <NotesScreen title="Family safe word" lines={['juniper lantern cobalt', 'Never text it. Never say it first. Change it if it is ever used in front of someone else.']} /> },
  { name: 'Trusted circle', copy: 'The people you can check with, and whether their safe word is set up.', screen: <ContactsScreen /> },
  { name: 'Every control', copy: 'Captions, language and your data, in one calm list. Nothing is hidden.', screen: <SettingsScreen /> },
]

function Gallery() {
  return (
    <HRail
      tone="ink"
      className="gallery"
      label="Every screen"
      chapter="Every screen"
      header={
        <div className="wrap gallery-head">
          <Slate index="Seven screens">The interface</Slate>
          <h2 className="display section-title">
            Every screen, <em>made to be calm.</em>
          </h2>
        </div>
      }
    >
      <div className="gallery-lead" aria-hidden="true" />
      {GALLERY.map((g, i) => (
        <figure key={g.name} className="gallery-item" style={vars({ '--i': i })}>
          <Phone width="var(--gallery-phone)">{g.screen}</Phone>
          <figcaption>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <b>{g.name}</b>
            <p>{g.copy}</p>
          </figcaption>
        </figure>
      ))}
      <div className="gallery-end" aria-hidden="true" />
    </HRail>
  )
}

export default function HowItWorks() {
  return (
    <>
      <PageHero
        reel="Reel I"
        name="How it works"
        num="1"
        title={
          <>
            Four calm steps between <em>a call</em> and a decision.
          </>
        }
        lead="Cadence is designed to add context to a call, not to replace your judgment. Scroll to watch the whole sequence, from the first signal to the choice that stays yours."
      />
      <Sequence />
      <Certainty />
      <Anatomy />
      <Gallery />
      <CtaBand
        tone="paper"
        title={
          <>
            See how these calls <em>are built.</em>
          </>
        }
        body="The best defence is knowing the script. Walk through a cloned-voice call beat by beat."
        to="/threats"
        label="The anatomy of a call"
      />
    </>
  )
}
