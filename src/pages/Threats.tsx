import { useState, type ReactNode } from 'react'
import { Banknote, EyeOff, HeartPulse, PhoneIncoming, RotateCcw, Timer, UserRoundX } from 'lucide-react'
import { CtaBand, PageHero, SectionHead, Slate } from '../components/bits'
import { HRail, Reveal } from '../components/motion'
import { useScrub } from '../lib/scrub'

// ---------------------------------------------------------------------------
// Anatomy of a call: a strip of film. Frames come into focus as they cross the
// middle of the screen.
// ---------------------------------------------------------------------------

const BEATS = [
  {
    n: '01',
    name: 'The hook',
    hear: '“Hi, it’s me…”',
    tactic: 'A familiar voice, often crying or on a bad line, lowers your guard before you have thought to question it.',
    act: 'A name on the screen can be spoofed. Notice that you are being led, not asked.',
  },
  {
    n: '02',
    name: 'The emergency',
    hear: '“I’ve been in an accident.” “I’m in trouble with the police.”',
    tactic: 'A high-stakes story makes your heart race and crowds out careful thinking.',
    act: 'Breathe. Real emergencies rarely need an answer in sixty seconds.',
  },
  {
    n: '03',
    name: 'The secret',
    hear: '“Please don’t tell Dad. Don’t tell anyone.”',
    tactic: 'Secrecy isolates you, so nobody can tell you it is a scam before it is too late.',
    act: 'Treat any request for secrecy as a red flag. Tell someone you trust, anyway.',
  },
  {
    n: '04',
    name: 'The clock',
    hear: '“It has to be done in the next hour.”',
    tactic: 'Manufactured urgency stops you from doing the one thing that works: checking.',
    act: 'Genuine people and institutions can wait a few minutes while you call back.',
  },
  {
    n: '05',
    name: 'The payment',
    hear: '“Wire it.” “Buy gift cards.” “Send crypto.” “A courier will collect cash.”',
    tactic: 'Payment methods that are fast, hard to trace and almost impossible to reverse.',
    act: 'No genuine emergency is solved with gift cards or crypto. Stop here.',
  },
  {
    n: '06',
    name: 'The exit',
    hear: '“The line is cutting out.” “Here’s my lawyer.”',
    tactic: 'The call ends or is handed to an official-sounding second voice, before you can verify.',
    act: 'Hang up. Call back on a number you already have, never one you were just given.',
  },
]

function Strip() {
  return (
    <HRail
      tone="paper"
      className="strip"
      label="Anatomy of a cloned-voice call"
      chapter="Anatomy of a call"
      header={
        <div className="wrap strip-head">
          <Slate index="The script">Anatomy of a call</Slate>
          <h2 className="display section-title">
            Six beats, in this order, <em>almost every time.</em>
          </h2>
          <p className="strip-hint" aria-hidden="true">
            Keep scrolling. The call unfolds sideways.
          </p>
        </div>
      }
    >
      <div className="strip-lead" aria-hidden="true" />
      {BEATS.map((b) => (
        <article key={b.n} className="frame" data-tone="ink" data-focus="">
          <header>
            <span className="frame-n">{b.n}</span>
            <h3 className="display">{b.name}</h3>
          </header>
          <blockquote>
            <span>You hear</span>
            {b.hear}
          </blockquote>
          <dl>
            <div>
              <dt>The tactic</dt>
              <dd>{b.tactic}</dd>
            </div>
            <div>
              <dt>What helps</dt>
              <dd>{b.act}</dd>
            </div>
          </dl>
        </article>
      ))}
      <div className="strip-end" data-tone="ink" data-focus="">
        <p className="display">
          The script <em>has no answer</em> to a call-back.
        </p>
      </div>
    </HRail>
  )
}

// ---------------------------------------------------------------------------
// Why it works: cards wipe open from the left as they cross the screen.
// ---------------------------------------------------------------------------

function Wipe({ children }: { children: ReactNode }) {
  const ref = useScrub<HTMLDivElement>({ mode: 'view' })
  return (
    <div ref={ref} className="wipe">
      <div className="wipe-inner">{children}</div>
    </div>
  )
}

function Why() {
  return (
    <section className="why" data-tone="ink" data-chapter="Why it works" aria-labelledby="why-title">
      <div className="wrap why-grid">
        <div className="why-sticky">
          <SectionHead
            index="Understand"
            label="Why it works"
            title={<span id="why-title">The technology is only half the trick.</span>}
            lead="Cloned voices don’t have to be perfect. They have to be good enough, for long enough, on a phone line, while you are frightened."
          />
        </div>
        <div className="why-list">
          <Wipe>
            <span className="why-n" aria-hidden="true">
              A
            </span>
            <h3 className="display">Audio is easy to find.</h3>
            <p>Videos, voicemail greetings, podcasts and social posts can be enough source material for some voice-cloning tools.</p>
          </Wipe>
          <Wipe>
            <span className="why-n" aria-hidden="true">
              B
            </span>
            <h3 className="display">Phone audio hides the flaws.</h3>
            <p>Compression, background noise and a hurried conversation can mask the small glitches that might otherwise give a clone away.</p>
          </Wipe>
          <Wipe>
            <span className="why-n" aria-hidden="true">
              C
            </span>
            <h3 className="display">Fear beats listening.</h3>
            <p>Stress narrows attention. The call is designed to keep you in that state until the money has moved.</p>
          </Wipe>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Red flags: a contact sheet of six frames.
// ---------------------------------------------------------------------------

const FLAGS = [
  { icon: Timer, title: 'Urgency', copy: '“Right now.” “Within the hour.” Pressure to act before you can think.' },
  { icon: EyeOff, title: 'Secrecy', copy: '“Don’t tell anyone.” Anyone who could talk you out of it is kept out.' },
  { icon: Banknote, title: 'Odd payment', copy: 'Gift cards, crypto, wires, or cash handed to a courier.' },
  { icon: HeartPulse, title: 'Big emotion', copy: 'Crying, panic or fear used to keep you from asking questions.' },
  { icon: PhoneIncoming, title: 'Unexpected contact', copy: 'A number you don’t know, or a call that arrives at a strange time.' },
  { icon: UserRoundX, title: 'Won’t be verified', copy: 'Refuses a call-back, a safe word, or “a question only you’d know”.' },
]

function Flags() {
  return (
    <section className="flags" data-tone="paper" data-chapter="Red flags" aria-labelledby="flags-title">
      <div className="wrap">
        <SectionHead
          index="Frames 01 to 06"
          label="Red flags"
          title={<span id="flags-title">Six things that should slow you down.</span>}
          lead="Any one of these is reason enough to hang up and verify. Two or more is a pattern."
        />
        <ul className="csheet">
          {FLAGS.map(({ icon: Icon, title, copy }, i) => (
            <Reveal as="li" key={title} delay={(i % 3) * 80} className="csheet-frame">
              <span className="csheet-no">{String(i + 1).padStart(2, '0')}A</span>
              <Icon size={30} strokeWidth={1.4} aria-hidden="true" />
              <h3 className="display">{title}</h3>
              <p>{copy}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Would you verify? Five calls. Calm feedback, no scores that shame.
// ---------------------------------------------------------------------------

const CASES = [
  {
    who: 'Your daughter',
    where: 'Text, then a short call',
    story: 'She texts “Dinner at 7?” and a minute later rings to say she’ll be ten minutes late. She asks for nothing.',
    verify: false,
    why: 'Nothing here asks for money, secrecy or speed. Being calm about ordinary calls is part of the skill. The point is to notice the pressure, not to distrust everyone.',
  },
  {
    who: 'Your son’s number',
    where: 'Incoming call',
    story: 'He is crying, says he has been in an accident, and needs money for the hospital right now. “Please don’t tell Mum.”',
    verify: true,
    why: 'Emotion, secrecy and urgency together. Hang up and call him back on the number you have saved, or reach someone who would be with him.',
  },
  {
    who: 'Your bank',
    where: 'Incoming call',
    story: 'The caller knows your name and asks you to read out the six-digit code that has just arrived by SMS, “to cancel a fraudulent payment”.',
    verify: true,
    why: 'A bank never needs a one-time code from you. End the call and ring the number printed on your card.',
  },
  {
    who: 'Your manager',
    where: 'Voice note, then a call',
    story: 'She sounds rushed and asks you to approve an unusual invoice today. “Keep this between us, don’t loop in finance.”',
    verify: true,
    why: 'A request to bypass the usual process, with a deadline and a secret, is a classic. Confirm through the normal channel, not the one she used.',
  },
  {
    who: 'A friend, new number',
    where: 'Message, then a call',
    story: '“Lost my phone, this is my temporary number.” Then: “Can you send me the code you just got? I need to recover my account.”',
    verify: true,
    why: 'Codes are the keys to your accounts. Ask something only your friend would know, or call their old number first.',
  },
]

function Quiz() {
  const [i, setI] = useState(0)
  const [picks, setPicks] = useState<(boolean | null)[]>(() => CASES.map(() => null))
  const done = i >= CASES.length
  const c = CASES[Math.min(i, CASES.length - 1)]
  const picked = picks[i]
  const right = picks.filter((p, k) => p !== null && p === CASES[k].verify).length

  const choose = (verify: boolean) => {
    if (picked !== null && picked !== undefined) return
    setPicks((prev) => prev.map((p, k) => (k === i ? verify : p)))
  }

  return (
    <section className="quiz" data-tone="ink" data-chapter="Would you verify?" aria-labelledby="quiz-title">
      <div className="wrap quiz-grid">
        <SectionHead
          index="Try it"
          label="Would you verify?"
          title={<span id="quiz-title">Five calls. One question each.</span>}
          lead="There are no scores to be ashamed of. Read the call, decide, and see what the pattern says."
        />
        <Reveal delay={100} className="quiz-card">
          {!done ? (
            <>
              <div className="quiz-meter" aria-hidden="true">
                {CASES.map((_, k) => (
                  <span key={k} className={k < i ? 'is-done' : k === i ? 'is-now' : undefined} />
                ))}
              </div>
              <p className="quiz-count">
                Call {String(i + 1).padStart(2, '0')} of {String(CASES.length).padStart(2, '0')}
              </p>
              <div className="quiz-from">
                <b>{c.who}</b>
                <span>{c.where}</span>
              </div>
              <p className="quiz-story">{c.story}</p>
              <div className="quiz-actions" role="group" aria-label="Your choice">
                <button type="button" className={`btn${picked === false ? ' is-picked' : ''}`} disabled={picked !== null} onClick={() => choose(false)}>
                  This looks fine
                </button>
                <button type="button" className={`btn${picked === true ? ' is-picked' : ''}`} disabled={picked !== null} onClick={() => choose(true)}>
                  I would verify first
                </button>
              </div>
              <div className="quiz-result" aria-live="polite">
                {picked !== null && picked !== undefined && (
                  <>
                    <p className="quiz-verdict">{picked === c.verify ? 'That matches the pattern.' : 'Worth a second look.'}</p>
                    <p>{c.why}</p>
                    <button type="button" className="btn btn--solid" onClick={() => setI(i + 1)}>
                      {i === CASES.length - 1 ? 'See the pattern' : 'Next call'}
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="quiz-end" aria-live="polite">
              <p className="quiz-count">All five calls</p>
              <p className="quiz-big">
                Emotion, secrecy, <em>speed.</em>
              </p>
              <p>
                When a call mixes any of these with a request for <b>money or a code</b>, hang up and verify on a channel you chose. Ordinary calls can stay ordinary.
                You matched the pattern on {right} of {CASES.length}, and the advice is the same either way.
              </p>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setI(0)
                  setPicks(CASES.map(() => null))
                }}
              >
                <RotateCcw size={16} aria-hidden="true" /> Try again
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Myths: each belief is struck through as it reaches the middle of the screen.
// ---------------------------------------------------------------------------

const MYTHS = [
  ['“I would know my own child’s voice.”', 'Clones can be convincing, especially over a phone line and while you are frightened. Rely on the process, not your ear.'],
  ['“This only happens to older people.”', 'Anyone with a phone can be called. Parents, partners and finance teams are all targeted.'],
  ['“If their name shows up, it’s them.”', 'Caller ID can be spoofed. A name on the screen is not proof of who is on the line.'],
  ['“A scammer would get the details wrong.”', 'Details are often found online or guessed. Correct details are not proof either.'],
]

function MythRow({ myth, fact }: { myth: string; fact: string }) {
  const ref = useScrub<HTMLLIElement>({ mode: 'view' })
  return (
    <li ref={ref} className="myth">
      <p className="myth-q">
        <span>Myth</span>
        <em>{myth}</em>
      </p>
      <p className="myth-a">
        <span>Fact</span>
        {fact}
      </p>
    </li>
  )
}

function Myths() {
  return (
    <section className="myths" data-tone="paper" data-chapter="Myth and fact" aria-labelledby="myths-title">
      <div className="wrap">
        <SectionHead index="Reality check" label="Myth and fact" title={<span id="myths-title">What people believe, and what’s true.</span>} />
        <ul className="myth-list">
          {MYTHS.map(([myth, fact]) => (
            <MythRow key={myth} myth={myth} fact={fact} />
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function Threats() {
  return (
    <>
      <PageHero
        reel="Reel II"
        name="The threat"
        num="2"
        title={
          <>
            It sounds like them. <em>That’s the point.</em>
          </>
        }
        lead="Some voice-cloning tools can imitate a person from surprisingly little audio, and a phone line hides a lot of flaws. Scammers don’t need perfection. They need you frightened for about ten minutes."
      />
      <Strip />
      <Why />
      <Flags />
      <Quiz />
      <Myths />
      <CtaBand
        tone="ink"
        title={
          <>
            Now make a plan <em>before</em> the call.
          </>
        }
        body="Five small habits make a cloned voice almost useless. Set them up once, together, in an evening."
        to="/playbook"
        label="Open the playbook"
      />
    </>
  )
}

