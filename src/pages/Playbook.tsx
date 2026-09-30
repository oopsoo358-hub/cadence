import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { CtaBand, PageHero, Slate } from '../components/bits'
import { CallBackScreen, ContactsScreen, MessagesScreen, NotesScreen, Phone } from '../components/devices'
import { Reveal, ScrubText, vars } from '../components/motion'

const HABITS = [
  { id: 'safe-word', n: 'I', short: 'Safe word' },
  { id: 'call-back', n: 'II', short: 'Call back' },
  { id: 'only-they-know', n: 'III', short: 'Ask a question' },
  { id: 'slow-money', n: 'IV', short: 'Slow the money' },
  { id: 'tell-someone', n: 'V', short: 'Tell someone' },
]

const WORDS = [
  'juniper', 'lantern', 'cobalt', 'marigold', 'harbor', 'pelican', 'saffron', 'tundra', 'velvet', 'orchard',
  'compass', 'thistle', 'quartz', 'willow', 'meadow', 'ember', 'basalt', 'clover', 'ferry', 'garnet',
  'hollow', 'indigo', 'kettle', 'lichen', 'mosaic', 'nutmeg', 'opal', 'pebble', 'quince', 'ribbon',
  'sparrow', 'teacup', 'umber', 'violet', 'walnut', 'yarrow', 'zephyr', 'anchor', 'bramble', 'cinder',
]

function pickWords(count = 3) {
  const pool = [...WORDS]
  const out: string[] = []
  const buf = new Uint32Array(count)
  crypto.getRandomValues(buf)
  for (let i = 0; i < count; i++) {
    out.push(pool.splice(buf[i] % pool.length, 1)[0])
  }
  return out
}

// ---------------------------------------------------------------------------
// The five habits. The phone beside them changes as each habit reaches the middle
// of the screen, and its safe-word note is the live result of the generator.
// ---------------------------------------------------------------------------

function habitScreens(title: string, phrase: string): ReactNode[] {
  return [
    <NotesScreen key="a" title={title} lines={[phrase, 'Never text it. Never say it first. Change it if it is ever used in front of someone else.']} />,
    <CallBackScreen key="b" />,
    <MessagesScreen
      key="c"
      title="Aarav"
      sub="mobile"
      messages={[
        { from: 'me', text: 'Quick check before I do anything. What did we eat the last time we were all together?' },
        { from: 'them', text: 'Dal baati at Nani’s. You burned the rotis.' },
        { from: 'me', text: 'That’s him. Thank you.' },
      ]}
    />,
    <NotesScreen
      key="d"
      title="Our money rule"
      lines={['No money moves because of a call alone.', 'Above our limit, two people must agree. Gift cards, crypto and cash for a courier: never.']}
    />,
    <ContactsScreen key="e" />,
  ]
}

function SafeWordControls({
  family,
  setFamily,
  shuffle,
  phrase,
  title,
}: {
  family: string
  setFamily: (v: string) => void
  shuffle: () => void
  phrase: string
  title: string
}) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${title}: ${phrase}. Never text it. Never say it first.`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard can be blocked; the phrase is visible on the note anyway */
    }
  }
  return (
    <div className="sw">
      <label htmlFor="family">Family name (optional)</label>
      <input id="family" type="text" value={family} maxLength={24} placeholder="e.g. Sharma" onChange={(e) => setFamily(e.target.value)} />
      <p className="sw-phrase" aria-live="polite">
        {phrase}
      </p>
      <div className="sw-buttons">
        <button type="button" className="btn btn--solid" onClick={shuffle}>
          <RefreshCw size={16} aria-hidden="true" /> Shuffle
        </button>
        <button type="button" className="btn" onClick={copy}>
          {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy note'}
        </button>
      </div>
      <p className="sw-note">Generated on your device. Nothing is sent or stored. Watch the phone: that is the note you would keep.</p>
    </div>
  )
}

function Habits() {
  const [active, setActive] = useState(0)
  const [family, setFamily] = useState('')
  const [words, setWords] = useState(() => pickWords())
  const phrase = words.join(' ')
  const title = family.trim() ? `The ${family.trim()} safe word` : 'Our family safe word'
  const screens = useMemo(() => habitScreens(title, phrase), [title, phrase])

  // Scrollspy: the habit crossing the middle of the viewport is the active one.
  useEffect(() => {
    const els = HABITS.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => !!el)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(HABITS.findIndex((h) => h.id === e.target.id))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const inline = (i: number) => (
    <div className="habit-inline" aria-hidden="true">
      <Phone width="min(250px, 70vw)">{screens[i]}</Phone>
    </div>
  )

  return (
    <div className="habits" data-tone="paper">
      <div className="wrap habits-grid">
        <aside className="habits-stage" aria-hidden="true">
          <ol className="habits-ticks">
            {HABITS.map((h, i) => (
              <li key={h.id} className={i === active ? 'is-on' : i < active ? 'is-past' : undefined}>
                <span>{h.n}</span>
              </li>
            ))}
          </ol>
          <p className="habits-name">{HABITS[active].short}</p>
          <Phone width="var(--habit-phone)" className="habits-phone">
            {screens.map((s, i) => (
              <div key={i} className={`habit-screen${i === active ? ' is-on' : ''}`}>
                {s}
              </div>
            ))}
          </Phone>
        </aside>

        <div className="habits-list">
          <article id="safe-word" className="habit" data-chapter="Habit I, safe word">
            <Reveal>
              <Slate index="One of five">Habit I</Slate>
              <h2 className="display habit-title">Agree on a safe word.</h2>
              <p className="lead">
                A word or short phrase only your family knows. If a caller can’t say it, hang up. A cloned voice can’t guess what it was never told.
              </p>
            </Reveal>
            {inline(0)}
            <Reveal delay={80}>
              <ul className="tips">
                <li>Use two or three unrelated words. Avoid pet names, streets, birthdays or anything you post online.</li>
                <li>Share it in person or by voice. Never in a text or chat that could be read later.</li>
                <li>Never say it first. Let the caller offer it.</li>
                <li>If it is ever used in front of someone else, change it.</li>
              </ul>
            </Reveal>
            <Reveal delay={120}>
              <SafeWordControls family={family} setFamily={setFamily} shuffle={() => setWords(pickWords())} phrase={phrase} title={title} />
            </Reveal>
          </article>

          <article id="call-back" className="habit" data-chapter="Habit II, call back">
            <Reveal>
              <Slate index="Two of five">Habit II</Slate>
              <h2 className="display habit-title">Always call back.</h2>
              <p className="lead">
                Hang up. Then call the person on the number already saved in your contacts, never the number that just called and never one you were just given.
              </p>
            </Reveal>
            {inline(1)}
            <div className="teleprompter">
              <p className="teleprompter-label">Say this when you call back</p>
              <ScrubText
                as="p"
                className="teleprompter-text"
                text="Hi, it’s me. Somebody just called sounding like you and asked for money. Can you tell me our safe word? If it was you, I’m sorry. I just need to be sure."
              />
            </div>
            <Reveal delay={60}>
              <ul className="tips">
                <li>If they don’t pick up, try someone who would be with them: a partner, a flatmate, a workplace.</li>
                <li>Don’t stay on the original call “to keep the line open”. That is the trap.</li>
              </ul>
            </Reveal>
          </article>

          <article id="only-they-know" className="habit" data-chapter="Habit III, ask a question">
            <Reveal>
              <Slate index="Three of five">Habit III</Slate>
              <h2 className="display habit-title">Ask what only they would know.</h2>
              <p className="lead">
                If you can’t call back straight away, ask a question with an answer that isn’t on any profile or in any photo.
              </p>
            </Reveal>
            {inline(2)}
            <Reveal delay={80} className="qa">
              <div className="qa-col">
                <p>Good questions</p>
                <ul>
                  <li>“What did we eat the last time we were all together?”</li>
                  <li>“What did you call the old dog’s blanket?”</li>
                  <li>“Which cousin fell in the pond?”</li>
                </ul>
              </div>
              <div className="qa-col qa-col--weak">
                <p>Weak questions</p>
                <ul>
                  <li>“What’s your birthday?”</li>
                  <li>“Where do you go to school or work?”</li>
                  <li>“What’s our dog’s name?”</li>
                </ul>
              </div>
            </Reveal>
          </article>

          <article id="slow-money" className="habit" data-chapter="Habit IV, slow the money">
            <Reveal>
              <Slate index="Four of five">Habit IV</Slate>
              <h2 className="display habit-title">Slow every payment.</h2>
              <p className="lead">
                Agree a rule: no money moves because of a phone call alone. The bigger the amount, the more people must say yes.
              </p>
            </Reveal>
            {inline(3)}
            <Reveal delay={80}>
              <dl className="rules">
                <div>
                  <dt>Never</dt>
                  <dd>gift cards, crypto or cash handed to a courier in response to a call.</dd>
                </div>
                <div>
                  <dt>Always</dt>
                  <dd>wait until you have verified, even if it means the money is late.</dd>
                </div>
                <div>
                  <dt>Two people</dt>
                  <dd>must agree before anything over your limit is sent.</dd>
                </div>
                <div>
                  <dt>If you already paid</dt>
                  <dd>call your bank straight away. Speed matters.</dd>
                </div>
              </dl>
            </Reveal>
          </article>

          <article id="tell-someone" className="habit" data-chapter="Habit V, tell someone">
            <Reveal>
              <Slate index="Five of five">Habit V</Slate>
              <h2 className="display habit-title">Tell someone, early.</h2>
              <p className="lead">
                These scams depend on you keeping quiet. Saying it out loud to anyone (a friend, your bank, a helpline, or the Cadence assistant) breaks the spell.
              </p>
            </Reveal>
            {inline(4)}
            <Reveal delay={80}>
              <p className="pull">“There is no shame in being called. The only mistake is staying alone with it.”</p>
            </Reveal>
          </article>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Readiness: every item you tick exposes one frame of the strip.
// ---------------------------------------------------------------------------

const CHECKLIST = [
  'We have agreed a family safe word.',
  'Everyone has each other’s numbers saved in their contacts.',
  'We all know the call-back rule.',
  'Our bank’s fraud line is saved, copied from the card, not a search.',
  'Older relatives have a copy of this playbook.',
  'We have set a limit above which a second person must agree.',
]

const STORE_KEY = 'cadence.playbook.checks'

function Checklist() {
  const [done, setDone] = useState<boolean[]>(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY)
      const parsed = raw ? (JSON.parse(raw) as unknown) : null
      if (Array.isArray(parsed) && parsed.length === CHECKLIST.length) return parsed.map(Boolean)
    } catch {
      /* storage unavailable */
    }
    return CHECKLIST.map(() => false)
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(done))
    } catch {
      /* storage unavailable */
    }
  }, [done])

  const count = done.filter(Boolean).length

  return (
    <section className="ready" data-tone="ink" data-chapter="Readiness" aria-labelledby="ready-title">
      <div className="wrap ready-grid">
        <Reveal className="ready-side">
          <Slate index="Your turn">Readiness</Slate>
          <h2 id="ready-title" className="display section-title">
            Are you <em>ready</em> for the call?
          </h2>
          <div className="exposure" role="img" aria-label={`${count} of ${CHECKLIST.length} done`}>
            {done.map((d, i) => (
              <span key={i} className={d ? 'is-lit' : undefined} style={vars({ '--i': i })}>
                {String(i + 1).padStart(2, '0')}
              </span>
            ))}
          </div>
          <p className="ready-count">
            <strong>{count}</strong> of {CHECKLIST.length} frames exposed
          </p>
          <p className="ready-note">Saved in this browser only, so you can come back to it.</p>
        </Reveal>
        <ul className="ready-list">
          {CHECKLIST.map((item, i) => (
            <Reveal as="li" key={item} delay={i * 50}>
              <label className={`check${done[i] ? ' is-done' : ''}`}>
                <input type="checkbox" checked={done[i]} onChange={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))} />
                <span className="check-box" aria-hidden="true">
                  <Check size={16} />
                </span>
                <span className="check-text">{item}</span>
              </label>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function Playbook() {
  return (
    <>
      <PageHero
        reel="Reel III"
        name="The playbook"
        num="3"
        title={
          <>
            Five habits that make a clone <em>useless.</em>
          </>
        }
        lead="None of these need an app. They take an evening to set up, and they work on any call, from anyone, whether or not Cadence is listening."
      />
      <Habits />
      <Checklist />
      <CtaBand
        tone="paper"
        title={
          <>
            Rehearse it <em>out loud.</em>
          </>
        }
        body="Talk through a call that worried you with the voice assistant. It will ask calm questions and help you plan the call-back."
        to="/assistant"
        label="Open the voice assistant"
      />
    </>
  )
}
