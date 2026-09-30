import { useEffect, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowDown, ArrowUpRight, Mic, Play, X } from 'lucide-react'
import { Slate } from '../components/bits'
import { ActiveCall, AlertSheet, IncomingCall, PauseScreen, Phone, VerifyScreen } from '../components/devices'
import { Marquee, Reveal, Scene, ScrubText, ScrubType, Shot, vars } from '../components/motion'
import { TLink } from '../components/Nav'
import { VoiceTracks } from '../components/VoiceTracks'
import { PAGES } from '../components/Shell'
import { useReducedMotion, useScrub, useVideoScrub } from '../lib/scrub'
import { filmClock } from '../lib/timecode'

const FILM = '/media/cadence-demo.mp4'
const POSTER = '/media/cadence-poster.jpg'

const CORNERS = (
  <div className="vf" aria-hidden="true">
    <i />
    <i />
    <i />
    <i />
  </div>
)

// ---------------------------------------------------------------------------
// Opening titles. A title card, then the first scene plays as you scroll: a
// phone rings, a call gets urgent, Cadence notices and suggests a pause.
// ---------------------------------------------------------------------------

const CALL_LINE = 'Mum? It’s me. I’m in trouble. Please don’t tell Dad. I need money, right now.'

function OpeningActions() {
  return (
    <div className="op-actions">
      <TLink to="/assistant" className="btn btn--solid">
        <Mic size={17} aria-hidden="true" /> Talk to Cadence
      </TLink>
      <TLink to="/how-it-works" className="btn">
        How it works <ArrowDown size={16} aria-hidden="true" />
      </TLink>
    </div>
  )
}

function Opening() {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <section className="opening-static" data-tone="ink" data-chapter="Opening titles" aria-label="Introduction">
        <div className="wrap opening-static-grid">
          <div>
            <Slate index="Opening titles">Scene one</Slate>
            <h1 className="display op-h1">
              A familiar voice isn’t <em>the whole story.</em>
            </h1>
            <p className="lead">
              AI can make a voice sound like someone you love. Cadence helps you notice when something feels off, take a breath, and verify, before you act.
            </p>
            <OpeningActions />
          </div>
          <Phone width="min(320px, 80vw)" style={vars({ '--s': 1 })}>
            <AlertSheet />
          </Phone>
        </div>
      </section>
    )
  }

  return (
    <Scene steps={10} length={560} tone="ink" className="opening" label="Introduction" chapter="Opening titles">
      {CORNERS}

      <Shot a={-1} b={0.2} f={0.09} className="op-card">
        <p className="op-word" aria-hidden="true">
          Cadence
        </p>
        <p className="op-tagline">A second signal for the calls that matter</p>
        <p className="op-start" aria-hidden="true">
          Scroll to begin <ArrowDown size={15} />
        </p>
      </Shot>

      <div className="wrap op-grid">
        <div className="op-left">
          <Shot a={0.2} b={0.42} f={0.05} className="op-panel">
            <Slate index="Opening titles">Scene one</Slate>
            <h1 className="display op-h1">
              A familiar voice isn’t <em>the whole story.</em>
            </h1>
            <p className="lead">
              AI can make a voice sound like someone you love. Cadence helps you notice when something feels off, take a breath, and verify, before you act.
            </p>
          </Shot>
          <Shot a={0.42} b={0.57} f={0.05} className="op-panel">
            <p className="op-slug">Kitchen, 2:14 pm</p>
            <p className="display op-line">
              It sounds <em>exactly</em> like him.
            </p>
          </Shot>
          <Shot a={0.57} b={0.68} f={0.05} className="op-panel">
            <p className="display op-line">
              But the words <em>don’t sit right.</em>
            </p>
          </Shot>
          <Shot a={0.68} b={0.82} f={0.05} className="op-panel">
            <p className="display op-line">
              Cadence noticed <em>three things.</em>
            </p>
            <p className="op-sub">Urgency. Secrecy. A voice that is unusually smooth. It is a signal, never proof.</p>
          </Shot>
          <Shot a={0.82} b={0.93} f={0.05} className="op-panel">
            <p className="display op-line">
              It decided nothing. So she <em>took a breath.</em>
            </p>
          </Shot>
          <Shot a={0.93} b={2} f={0.05} className="op-panel op-panel--end">
            <p className="display op-line op-line--sm">
              Nothing was blocked. Nothing was decided <em>for her.</em>
            </p>
            <OpeningActions />
          </Shot>
        </div>

        <div className="op-right">
          <div className="op-phone">
            <Phone width="var(--stage-phone)">
              <Shot a={-1} b={0.44} f={0.04}>
                <IncomingCall banner="ask" />
              </Shot>
              <Shot a={0.4} b={0.66} f={0.04}>
                <ActiveCall strip="listening" time="00:11" captions={<ScrubType text={CALL_LINE} a={0.44} b={0.6} />} />
              </Shot>
              <Shot a={0.62} b={0.84} f={0.04} style={vars({ '--s': 'clamp(0, calc((var(--p) - 0.64) / 0.15), 1)' })}>
                <AlertSheet />
              </Shot>
              <Shot a={0.8} b={2} f={0.04} style={vars({ '--cd': 'calc(0.04 + 0.3 * clamp(0, calc((var(--p) - 0.84) / 0.15), 1))' })}>
                <PauseScreen />
              </Shot>
            </Phone>
          </div>
        </div>
      </div>
    </Scene>
  )
}

// ---------------------------------------------------------------------------
// Manifesto. An iris opens on paper and the statement is lit word by word.
// ---------------------------------------------------------------------------

function Manifesto() {
  return (
    <Scene length={260} tone="paper" className="manifesto" label="Our idea" chapter="The idea">
      <div className="wrap manifesto-inner">
        <Slate index="One sentence">The idea</Slate>
        <ScrubText
          as="h2"
          mode="pin"
          className="display manifesto-text"
          accent={['verify', 'person', 'them']}
          text="AI can make a voice sound like someone you love. It can’t make it be them. So Cadence never asks you to trust a voice. It helps you verify a person."
        />
      </div>
      <div className="iris" aria-hidden="true" />
    </Scene>
  )
}

// ---------------------------------------------------------------------------
// The film. The page scroll is the playhead: scroll and the film plays. Or
// press play to watch it at full speed.
// ---------------------------------------------------------------------------

function FilmDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="btn btn--solid">
        <Play size={16} aria-hidden="true" /> Play at full speed
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="film-overlay" />
        <Dialog.Content className="film-dialog" aria-describedby={undefined}>
          <Dialog.Title className="sr-only">Cadence, a short film about a pause</Dialog.Title>
          <video className="film-video" src={FILM} poster={POSTER} controls autoPlay playsInline />
          <Dialog.Close className="film-close" aria-label="Close the film">
            <X size={20} aria-hidden="true" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Theatre() {
  const reduced = useReducedMotion()
  const scene = useScrub<HTMLElement>({ mode: 'pin' })
  const video = useRef<HTMLVideoElement>(null)
  const tc = useRef<HTMLSpanElement>(null)
  useVideoScrub(video, scene, 0.1, 0.93, 2.6)

  // The timecode under the screen follows the film's own playhead.
  useEffect(() => {
    const v = video.current
    if (!v) return
    let raf = 0
    let last = ''
    const tick = () => {
      const c = filmClock(v.currentTime || 0)
      if (c !== last && tc.current) {
        tc.current.textContent = c
        last = c
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section
      ref={scene}
      className="scene theatre"
      data-tone="ink"
      data-chapter="The film"
      aria-label="Demo film"
      style={vars({ '--len': 520 })}
    >
      <div className="scene-stage">
        {CORNERS}
        <div className="wrap theatre-grid">
          <div className="theatre-head">
            <Slate index="76 seconds">The film</Slate>
            <h2 className="display theatre-title">
              A call, and <em>the pause</em> that followed.
            </h2>
            <div className="theatre-actions">
              <FilmDialog />
              <p className="theatre-hint" aria-hidden="true">
                or keep scrolling: the film plays as you do
              </p>
            </div>
          </div>
          <div className="theatre-screen">
            <div className="theatre-frame">
              <video
                ref={video}
                className="theatre-video"
                src={FILM}
                poster={POSTER}
                muted
                playsInline
                preload="auto"
                controls={reduced}
                aria-describedby="film-desc"
              />
            </div>
            <div className="theatre-tc" aria-hidden="true">
              <span>
                TC <span ref={tc}>00:00:00</span>
              </span>
              <span>Silent, with intertitles</span>
            </div>
          </div>
        </div>
        <p id="film-desc" className="sr-only">
          A silent short film. A mother gets a call that sounds exactly like her son asking for money. Cadence points out three signs common to voice-clone scams. She takes a breath, calls him back on his saved number, and learns it was not him. Nothing was blocked and nothing was decided for her.
        </p>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Three beats, developed like contact prints as the section scrolls through.
// ---------------------------------------------------------------------------

const BEATS = [
  {
    n: 'I',
    name: 'Notice',
    title: 'Hear what the call is doing.',
    body: 'Cadence looks for patterns that can show up in generated or altered speech, and for the pressure tactics that travel with them. It is a signal, never a verdict.',
    tag: 'Signal, not certainty',
  },
  {
    n: 'II',
    name: 'Pause',
    title: 'Make room for doubt.',
    body: 'When something looks off you get a calm prompt, not an alarm. Breathe. Don’t send money yet. Nothing has to happen in the next five minutes.',
    tag: 'No panic buttons',
  },
  {
    n: 'III',
    name: 'Verify',
    title: 'Confirm it in a way only you can.',
    body: 'Call back on a number you already trust, ask for the family safe word, or check with someone close to them. You choose the channel. You make the call.',
    tag: 'You stay in control',
  },
] as const

function BeatScreen({ name }: { name: (typeof BEATS)[number]['name'] }) {
  if (name === 'Notice') return <ActiveCall strip="listening" time="00:11" captions="“I need money. Right now.”" />
  if (name === 'Pause') return <PauseScreen />
  return <VerifyScreen pick={0} />
}

function Triptych() {
  const ref = useScrub<HTMLElement>({ mode: 'view' })
  return (
    <section ref={ref} className="triptych" data-tone="paper" data-chapter="Three beats" aria-labelledby="tri-title">
      <div className="wrap">
        <Reveal className="section-head">
          <Slate index="I, II, III">Three beats</Slate>
          <h2 id="tri-title" className="display section-title">
            Notice. Pause. <em>Verify.</em>
          </h2>
        </Reveal>
        <div className="tri-row">
          {BEATS.map((b, i) => (
            <article key={b.name} className="tri-col" style={vars({ '--k': `clamp(0, calc((var(--p) - ${(0.16 + i * 0.07).toFixed(2)}) / 0.2), 1)`, '--i': i })}>
              <span className="tri-word" aria-hidden="true">
                {b.name}
              </span>
              <div className="tri-phone">
                <Phone width="min(270px, 74vw)">
                  <BeatScreen name={b.name} />
                </Phone>
              </div>
              <div className="tri-copy">
                <p className="tri-n">{b.n}</p>
                <h3 className="display">{b.title}</h3>
                <p>{b.body}</p>
                <span className="tag">{b.tag}</span>
              </div>
            </article>
          ))}
        </div>
        <Reveal className="tri-more">
          <TLink to="/how-it-works" className="btn btn--solid">
            See the four steps in motion <ArrowUpRight size={16} aria-hidden="true" />
          </TLink>
        </Reveal>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// The programme: an index of every reel.
// ---------------------------------------------------------------------------

function Reels() {
  const rows = [
    ...PAGES.map((p) => ({ to: p.to, n: p.roman, label: p.label, blurb: p.blurb, run: p.run })),
    { to: '/assistant', n: 'Live', label: 'Voice assistant', blurb: 'Talk a suspicious call through, out loud, with a calm second opinion.', run: 'Any time' },
  ]
  return (
    <section className="reels" data-tone="ink" data-chapter="The programme" aria-labelledby="reels-title">
      <div className="wrap">
        <Reveal className="section-head">
          <Slate index="Six items">The programme</Slate>
          <h2 id="reels-title" className="display section-title">
            Everything, <em>at your pace.</em>
          </h2>
        </Reveal>
        <ul className="reel-list">
          {rows.map((r, i) => (
            <Reveal as="li" key={r.to} delay={i * 50}>
              <TLink to={r.to} className="reel-row">
                <span className="reel-n">{r.n}</span>
                <span className="reel-title">{r.label}</span>
                <span className="reel-blurb">{r.blurb}</span>
                <span className="reel-run">{r.run}</span>
                <span className="reel-go" aria-hidden="true">
                  <ArrowUpRight size={22} />
                </span>
              </TLink>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Voice band: the assistant's two sound tracks, playing on their own.
// ---------------------------------------------------------------------------

function VoiceBand() {
  return (
    <section className="voice-band" data-tone="paper" data-chapter="Voice assistant" aria-labelledby="voice-band-title">
      <div className="wrap voice-band-grid">
        <div className="voice-band-copy">
          <Reveal>
            <Slate index="Live">Voice assistant</Slate>
            <h2 id="voice-band-title" className="display section-title">
              Not sure about a call? <em>Say it out loud.</em>
            </h2>
            <p className="lead">
              Describe what happened in your own words. Cadence listens, asks the right questions and helps you decide your next move, by voice and at your pace.
            </p>
            <TLink to="/assistant" className="btn btn--solid">
              <Mic size={17} aria-hidden="true" /> Open the voice assistant
            </TLink>
          </Reveal>
        </div>
        <Reveal delay={120} className="voice-band-art">
          <VoiceTracks />
          <div className="duet-legend">
            <span>You, on the upper track</span>
            <span>Cadence, below</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Opening />
      <div className="marquee-wrap" data-tone="ink">
        <Marquee items={['Notice the signal', 'Pause with purpose', 'Verify with care', 'You make the call']} />
      </div>
      <Manifesto />
      <Theatre />
      <Triptych />
      <Reels />
      <VoiceBand />
    </>
  )
}
