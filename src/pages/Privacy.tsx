import { useEffect, useRef } from 'react'
import { CtaBand, PageHero, SectionHead, Slate } from '../components/bits'
import { ActiveCall, ConsentScreen, Phone } from '../components/devices'
import { Reveal, Scene, vars } from '../components/motion'
import { measure, prefersReducedMotion, subscribeScroll, useReducedMotion, useScrub } from '../lib/scrub'

// ---------------------------------------------------------------------------
// Consent, played as a scene: the switches on the phone flip as you scroll, and
// the words beside it light up to match.
// ---------------------------------------------------------------------------

const CONSENT = [
  { t: 't1', title: 'This call only.', body: 'Cadence asks again next time. Saying yes once never turns listening on for good.' },
  { t: 't2', title: 'Keep no audio.', body: 'What it hears is discarded when the call ends, unless you choose otherwise.' },
  { t: 't3', title: 'Show what I hear.', body: 'Live captions on your screen, so you can see exactly what Cadence is working from.' },
]

function Consent() {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <section className="consent-static" data-tone="ink" data-chapter="Asks first" aria-label="Consent comes first">
        <div className="wrap consent-static-grid">
          <div>
            <Slate index="The first question">Consent</Slate>
            <h2 className="display section-title">
              Every call starts with <em>a question.</em>
            </h2>
            <p className="lead">Cadence cannot listen in the background and has no silent mode. Before it hears a word, it asks you, for that call only.</p>
            <ol className="consent-list">
              {CONSENT.map((c, i) => (
                <li key={c.t} style={vars({ '--on': 1 })}>
                  <span>{['I', 'II', 'III'][i]}</span>
                  <div>
                    <b>{c.title}</b>
                    <p>{c.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <Phone width="min(320px, 80vw)" style={vars({ '--t1': 1, '--t2': 1, '--t3': 1 })}>
            <ConsentScreen scrub />
          </Phone>
        </div>
      </section>
    )
  }

  return (
    <Scene length={300} tone="ink" className="consent" label="Consent comes first" chapter="Asks first">
      <div
        className="wrap consent-grid"
        style={vars({
          '--t1': 'clamp(0, calc((var(--p) - 0.14) / 0.1), 1)',
          '--t2': 'clamp(0, calc((var(--p) - 0.36) / 0.1), 1)',
          '--t3': 'clamp(0, calc((var(--p) - 0.58) / 0.1), 1)',
        })}
      >
        <div className="consent-left">
          <Slate index="The first question">Consent</Slate>
          <h2 className="display section-title">
            Every call starts with <em>a question.</em>
          </h2>
          <p className="lead">Cadence cannot listen in the background and has no silent mode. Before it hears a word, it asks you, for that call only.</p>
          <ol className="consent-list">
            {CONSENT.map((c, i) => (
              <li key={c.t} style={vars({ '--on': `var(--${c.t})` })}>
                <span>{['I', 'II', 'III'][i]}</span>
                <div>
                  <b>{c.title}</b>
                  <p>{c.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="consent-right">
          <Phone width="var(--stage-phone)">
            <ConsentScreen scrub />
          </Phone>
        </div>
      </div>
    </Scene>
  )
}

// ---------------------------------------------------------------------------
// Commitments: what Cadence will do, and what it never will, one pair at a time.
// ---------------------------------------------------------------------------

const PAIRS = [
  { will: ['Ask before it listens.', 'Consent comes first, every time, for every call.'], wont: ['Listen in secret.', 'No background listening. No silent mode.'] },
  { will: ['Explain itself in plain words.', 'What it noticed, with no scores or jargon.'], wont: ['Claim to be certain.', 'A signal is never proof of who is calling.'] },
  { will: ['Say when it is unsure.', 'Uncertainty is shown, not hidden.'], wont: ['Act without you.', 'It never blocks, deletes or calls on your behalf.'] },
  { will: ['Help you verify your way.', 'Your channel, your contacts, your decision.'], wont: ['Rush or shame you.', 'No countdowns, sirens or guilt.'] },
  { will: ['Keep as little as possible.', 'Designed to hold audio briefly, if at all.'], wont: ['Sell or share your calls.', 'Not for ads. Not for anyone else.'] },
  { will: ['Let you delete everything.', 'One clear control, no dark patterns.'], wont: ['Train on your audio.', 'Not without a clear, separate opt-in.'] },
]

function Commitments() {
  return (
    <Scene length={330} tone="paper" className="promise" label="What Cadence will and will not do" chapter="Design commitments">
      <div className="wrap promise-inner">
        <div className="promise-head">
          <Slate index="Commitments">Design commitments</Slate>
          <h2 className="display section-title">
            What Cadence <em>will</em> do, and what it <em>never</em> will.
          </h2>
        </div>
        <div className="promise-table">
          <p className="promise-col promise-col--will">Cadence will</p>
          <p className="promise-col promise-col--wont">Cadence won’t</p>
          {PAIRS.map((p, i) => (
            <div key={p.will[0]} className="pair" style={vars({ '--i': i })}>
              <div className="pair-will">
                <b>{p.will[0]}</b>
                <span>{p.will[1]}</span>
              </div>
              <div className="pair-wont">
                <b>{p.wont[0]}</b>
                <span>{p.wont[1]}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="promise-fine">Design commitments for the product as described. Final policies will be published before launch.</p>
      </div>
    </Scene>
  )
}

// ---------------------------------------------------------------------------
// Limits: a wrong answer in either direction, each shown on a phone.
// ---------------------------------------------------------------------------

function Limits() {
  return (
    <section className="limits" data-tone="ink" data-chapter="Limits" aria-labelledby="limits-title">
      <div className="wrap">
        <SectionHead
          index="Honesty"
          label="Limits"
          title={<span id="limits-title">Wrong in both directions, and built for it.</span>}
          lead="No detector is perfect. So Cadence is designed around the two ways it can be wrong, and never uses the word “safe”."
        />
        <div className="limit-grid">
          <Reveal className="limit">
            <Phone width="min(250px, 66vw)">
              <ActiveCall strip="alert" name="Mum" time="01:07" captions="“Hello? Sorry, the line is terrible in the lift. Can you hear me?”" />
            </Phone>
            <div className="limit-copy">
              <p className="limit-tag">A real call gets flagged</p>
              <h3 className="display">The false alarm.</h3>
              <p>Poor reception, a cold, a noisy room. A real person can sound odd on a bad line.</p>
              <dl>
                <div>
                  <dt>What you see</dt>
                  <dd>“Worth a second look”, in soft language, with an easy dismiss.</dd>
                </div>
                <div>
                  <dt>What it costs</dt>
                  <dd>A thirty-second call-back. No blame on anyone.</dd>
                </div>
              </dl>
            </div>
          </Reveal>
          <Reveal delay={120} className="limit">
            <Phone width="min(250px, 66vw)">
              <ActiveCall strip="quiet" name="Aarav" time="00:19" captions="“Mum? It’s me. I’m in trouble. I need money, right now.”" />
            </Phone>
            <div className="limit-copy">
              <p className="limit-tag">A cloned call goes unflagged</p>
              <h3 className="display">The miss.</h3>
              <p>Good clones exist, and detection is an arms race. Silence from Cadence is not a green light.</p>
              <dl>
                <div>
                  <dt>What you see</dt>
                  <dd>“No strong signal”. Never “safe” or “verified”.</dd>
                </div>
                <div>
                  <dt>What still protects you</dt>
                  <dd>The habits: call back, safe word, slow the money.</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Lifecycle: one call from start to finish. The audio trace fills as you read
// down, and is erased again at the end, because the audio goes away.
// ---------------------------------------------------------------------------

const LIFECYCLE = [
  ['You opt in', 'Nothing starts until you turn it on, and you can turn it off at any time.'],
  ['A call begins', 'Cadence asks whether it may listen to this call. You answer.'],
  ['Audio is checked for patterns', 'Only while the call is live, and only for the signals described on this site.'],
  ['You see a signal and a suggestion', 'Plain words, one next step, and a way to dismiss it.'],
  ['You choose what happens', 'Cadence never acts for you. The decision and the call-back are yours.'],
  ['The audio goes away', 'Designed to be discarded when the call ends, unless you explicitly save it.'],
]

const BARS = 140
const AMP = Array.from({ length: BARS }, (_, i) => {
  const a = Math.abs(Math.sin(i * 0.37) * 0.55 + Math.sin(i * 1.13 + 1) * 0.3 + Math.sin(i * 2.9 + 2) * 0.15)
  const env = 0.35 + 0.65 * Math.abs(Math.sin(i * 0.05 + 0.6))
  return Math.min(1, a * env + 0.06)
})

/** Draws `BARS` level bars. `fill` is how far the audio has arrived, `erase` how far it has been wiped. */
function AudioTrace({ progress }: { progress: React.RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const host = progress.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !host || !ctx) return
    let w = 0
    let h = 0
    let last = -1
    const fg = getComputedStyle(canvas).color

    const size = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      last = -1
    }
    size()
    window.addEventListener('resize', size)

    const draw = (p: number) => {
      const fill = Math.min(1, Math.max(0, (p - 0.1) / 0.62))
      const erase = Math.min(1, Math.max(0, (p - 0.8) / 0.17))
      ctx.clearRect(0, 0, w, h)
      const step = w / BARS
      const mid = h / 2
      ctx.fillStyle = fg
      for (let i = 0; i < BARS; i++) {
        const x = i * step
        const f = i / BARS
        let a = 0.03
        if (f < fill) a = AMP[i]
        if (f < erase) a = 0.03
        const bh = Math.max(2, a * h * 0.92)
        ctx.globalAlpha = f < fill && f >= erase ? 1 : 0.35
        ctx.fillRect(x + step * 0.22, mid - bh / 2, Math.max(1.5, step * 0.56), bh)
      }
      // the playhead and the eraser
      ctx.globalAlpha = 1
      if (fill > 0 && fill < 1) ctx.fillRect(fill * w, 0, 1.5, h)
      if (erase > 0 && erase < 1) {
        ctx.fillRect(erase * w, 0, 1.5, h)
      }
      ctx.globalAlpha = 1
    }

    if (prefersReducedMotion()) {
      draw(0.6)
      return () => window.removeEventListener('resize', size)
    }

    const unsub = subscribeScroll((vh) => {
      // Pinned on large screens; on small ones the scene is a plain section, so follow it through the viewport.
      const pinned = host.getBoundingClientRect().height > vh + 40
      const p = pinned ? measure(host, 'pin', vh) : Math.min(1, Math.max(0, (measure(host, 'view', vh) - 0.25) / 0.5))
      const q = Math.round(p * 800)
      if (q === last) return
      last = q
      draw(p)
    })
    return () => {
      unsub()
      window.removeEventListener('resize', size)
    }
  }, [progress])

  return <canvas ref={ref} className="trace" aria-hidden="true" />
}

function Lifecycle() {
  const ref = useScrub<HTMLElement>({ mode: 'pin' })
  return (
    <section
      ref={ref}
      className="scene life"
      data-tone="paper"
      data-chapter="Lifecycle of a call"
      aria-labelledby="life-title"
      style={vars({ '--len': 340 })}
    >
      <div className="scene-stage">
        <div className="wrap life-wrap">
          <AudioTrace progress={ref} />
          <div className="life-grid">
            <div className="life-head">
              <SectionHead
                index="Data"
                label="Lifecycle"
                title={<span id="life-title">Follow one call, start to finish.</span>}
                lead="This is the path a call is designed to take. The line above fills as the call goes on, and is wiped at the end."
              />
            </div>
            <ol className="life-steps" style={vars({ '--n': LIFECYCLE.length })}>
              {LIFECYCLE.map(([title, body], i) => (
                <li key={title} style={vars({ '--i': i })}>
                  <span className="life-no">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------

const INCLUSION = [
  { title: 'Screen-reader friendly', copy: 'Every state is announced, every control is labelled and reachable by keyboard.' },
  { title: 'Captions for every voice', copy: 'Anything Cadence says aloud can be read, and you can type instead of speaking.' },
  { title: 'Calm motion', copy: 'Animation is gentle, and it switches off when your device asks for less motion.' },
  { title: 'Plain language', copy: 'Short sentences and no jargon. In a frightening moment, clarity is kindness.' },
]

function Inclusion() {
  return (
    <section className="incl" data-tone="ink" data-chapter="Accessibility" aria-labelledby="incl-title">
      <div className="wrap">
        <SectionHead index="Everyone" label="Accessibility" title={<span id="incl-title">Built for the person who needs it most.</span>} />
        <ul className="incl-list">
          {INCLUSION.map(({ title, copy }, i) => (
            <Reveal as="li" key={title} delay={i * 70} className="incl-row">
              <span className="incl-n">{['I', 'II', 'III', 'IV'][i]}</span>
              <h3 className="display">{title}</h3>
              <p>{copy}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function Privacy() {
  return (
    <>
      <PageHero
        reel="Reel IV"
        name="Privacy & limits"
        num="4"
        title={
          <>
            Protection that <em>asks first.</em>
          </>
        }
        lead="A tool that listens to calls has to earn trust before it does anything else. These are the commitments Cadence is designed around, including the honest limits of what it can know."
      />
      <Consent />
      <Commitments />
      <Limits />
      <Lifecycle />
      <Inclusion />
      <CtaBand
        tone="paper"
        title={
          <>
            Still have <em>questions?</em>
          </>
        }
        body="Straight answers, and what to do if you think you have already been targeted."
        to="/help"
        label="Go to Help"
      />
    </>
  )
}
