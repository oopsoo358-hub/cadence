import { useMemo, useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { ArrowUpRight, ChevronDown, Search } from 'lucide-react'
import { CtaBand, PageHero, SectionHead, Slate } from '../components/bits'
import { ActiveCall, CallBackScreen, MessagesScreen, ReportScreen } from '../components/devices'
import { Reveal, StepScene, vars, type StepDef } from '../components/motion'
import { TLink } from '../components/Nav'
import { useScrub } from '../lib/scrub'

// ---------------------------------------------------------------------------
// Questions, answered calmly. Search across every topic, or browse by tab.
// ---------------------------------------------------------------------------

type QA = { q: string; a: string }

const FAQ: Record<string, QA[]> = {
  basics: [
    {
      q: 'What is Cadence?',
      a: 'Cadence is designed to help you pause and verify when a call might involve a cloned or altered voice. It adds context to a call, such as a plain-language signal and a suggested next step. It does not make the decision for you.',
    },
    {
      q: 'Can it tell me for certain whether a voice is fake?',
      a: 'No, and it is built not to pretend otherwise. Voice analysis can be wrong in both directions. Cadence reports a signal, not a verdict, and never tells you a call is “safe”.',
    },
    {
      q: 'Who is it for?',
      a: 'Anyone who takes calls from people they care about or work with. That is most of us, but parents, grandparents and finance teams are targeted most often.',
    },
  ],
  safety: [
    {
      q: 'What should I do if a call feels wrong?',
      a: 'Hang up. Call the person back on a number you already have saved, not the one that just called. If you can’t reach them, try someone who would be with them. Don’t send money or share codes until you have verified.',
    },
    {
      q: 'What if I have already sent money?',
      a: 'Call your bank or payment provider straight away using the number on your card or their official app. Speed matters. Then report it to your local authority (see the report section below) and tell someone you trust.',
    },
    {
      q: 'Is a safe word really worth it?',
      a: 'Yes. It is the simplest defence there is, it works on every call, and a cloned voice can’t answer something it was never told. See the playbook for how to set one up.',
    },
  ],
  privacy: [
    {
      q: 'Does Cadence listen to my calls all the time?',
      a: 'No. It is designed to ask for your consent before it listens to any call, and there is no background or silent mode.',
    },
    {
      q: 'Is my audio kept or shared?',
      a: 'Cadence is designed to keep as little as possible, for as short as possible, and never to sell or share your calls. You can delete your data at any time. See the privacy page for the full list of commitments.',
    },
    {
      q: 'Does the voice assistant record me?',
      a: 'The assistant uses your microphone only after you press Start, shows clearly when it is listening, and lets you mute or end at any moment. You can also type instead of speaking.',
    },
  ],
  assistant: [
    {
      q: 'What can I ask the voice assistant?',
      a: 'Describe a call that worried you and it will ask calm questions, point out pressure tactics, and help you plan a safe call-back. You can interrupt it at any time, just by speaking.',
    },
    {
      q: 'Do I have to speak?',
      a: 'No. Every reply has captions and a transcript, and there is a message box so you can type instead.',
    },
    {
      q: 'Why does the assistant page say “preview”?',
      a: 'While the voice service is being connected, the page shows a scripted sample conversation so the experience can be reviewed. The badge disappears when live replies are switched on.',
    },
  ],
}

const TABS = [
  ['basics', 'Basics'],
  ['safety', 'Staying safe'],
  ['privacy', 'Privacy'],
  ['assistant', 'Voice assistant'],
] as const

function Item({ item }: { item: QA }) {
  return (
    <details className="qa-item">
      <summary>
        <span>{item.q}</span>
        <ChevronDown size={22} strokeWidth={1.4} aria-hidden="true" />
      </summary>
      <div className="qa-body">
        <p>{item.a}</p>
      </div>
    </details>
  )
}

function Faq() {
  const [tab, setTab] = useState<string>('basics')
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const matches = useMemo(() => {
    if (!q) return []
    const words = q.split(/\s+/)
    return TABS.flatMap(([v, label]) =>
      FAQ[v]
        .filter((item) => words.every((w) => `${item.q} ${item.a}`.toLowerCase().includes(w)))
        .map((item) => ({ item, label })),
    )
  }, [q])

  return (
    <section className="faq" data-tone="paper" data-chapter="Questions" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <div className="faq-head">
          <SectionHead
            index="Answers"
            label="FAQ"
            title={<span id="faq-title">Questions, answered calmly.</span>}
            lead="Short, honest answers. If yours isn’t here, the voice assistant is happy to talk it through."
          />
          <Reveal delay={80} className="faq-search">
            <label htmlFor="faq-q">
              <Search size={16} aria-hidden="true" /> Search the answers
            </label>
            <input id="faq-q" type="search" value={query} placeholder="Try “money”, “audio” or “safe word”" onChange={(e) => setQuery(e.target.value)} />
            <p className="faq-count" aria-live="polite">
              {q ? (matches.length ? `${matches.length} ${matches.length === 1 ? 'answer' : 'answers'} found` : 'Nothing found') : ''}
            </p>
          </Reveal>
        </div>

        <Reveal delay={120} className="faq-body">
          {q ? (
            <div className="faq-results">
              {matches.length === 0 ? (
                <p className="faq-empty">
                  No answer matches that. <TLink to="/assistant">Ask the voice assistant instead</TLink>, in your own words.
                </p>
              ) : (
                matches.map(({ item, label }) => (
                  <div key={item.q} className="faq-hit">
                    <span className="faq-topic">{label}</span>
                    <Item item={item} />
                  </div>
                ))
              )}
            </div>
          ) : (
            <Tabs.Root value={tab} onValueChange={setTab}>
              <Tabs.List className="faq-tabs" aria-label="FAQ topics">
                {TABS.map(([v, label]) => (
                  <Tabs.Trigger key={v} value={v} className="faq-tab">
                    {label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
              {TABS.map(([v]) => (
                <Tabs.Content key={v} value={v} className="faq-panel">
                  {FAQ[v].map((item) => (
                    <Item key={item.q} item={item} />
                  ))}
                </Tabs.Content>
              ))}
            </Tabs.Root>
          )}
        </Reveal>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// If it happened: five steps, in order, each with the screen you would be on.
// ---------------------------------------------------------------------------

const STEPS: StepDef[] = [
  {
    key: 'Stop',
    time: 'Right now',
    title: 'Stop the call.',
    body: 'Hang up. You owe nobody an answer in the next five minutes, however urgent they sound.',
    aside: 'Nothing is lost by ending it',
    screen: <ActiveCall strip="alert" time="03:41" captions="“You have to do it now, you can’t tell anyone.”" />,
  },
  {
    key: 'Hold',
    time: 'Next',
    title: 'Don’t pay or share codes.',
    body: 'No transfers, gift cards, crypto, or one-time passcodes until you have verified who is really asking.',
    aside: 'A code is a key to your account',
    screen: (
      <MessagesScreen
        title="Your bank"
        sub="Verified sender"
        messages={[{ from: 'them', text: 'Your one-time code is 482913. Never share it with anyone, including our staff.' }]}
      />
    ),
  },
  {
    key: 'Verify',
    time: 'Then',
    title: 'Call back on a trusted number.',
    body: 'Use the number saved in your contacts, or one printed on a card or an official site. Never one you were just given.',
    aside: 'Your channel, your choice',
    screen: <CallBackScreen />,
  },
  {
    key: 'Bank',
    time: 'If money has moved',
    title: 'Call your bank now.',
    body: 'Use the fraud line on your card or in their official app. Speed matters, and you will not be judged for asking.',
    aside: 'Minutes count',
    screen: <ActiveCall name="Bank fraud line" time="00:42" strip={null} />,
  },
  {
    key: 'Report',
    time: 'When you can',
    title: 'Report it.',
    body: 'Reports help other people, and can help recover money. Reporting points change, so check with your local authority.',
    aside: 'It helps the next person',
    screen: <ReportScreen />,
  },
]

function Targeted() {
  return (
    <StepScene
      steps={STEPS}
      length={420}
      label="If you think you were targeted"
      chapter="If it happened"
      kicker={
        <>
          <Slate index="If it happens">If you think you were targeted</Slate>
          <p className="stepscene-lede">It happens to careful, clever people every day. What matters is what you do next.</p>
        </>
      }
    />
  )
}

// ---------------------------------------------------------------------------
// Who to report to. The footer links straight here (/help#report).
// ---------------------------------------------------------------------------

function Report() {
  return (
    <section id="report" className="report" data-tone="paper" data-chapter="Who to report to" aria-labelledby="report-title">
      <div className="wrap">
        <SectionHead
          index="Three places"
          label="Report"
          title={<span id="report-title">Who to report to.</span>}
          lead="Reporting points change, so check with your local authority. These are good places to start."
        />
        <ul className="report-list">
          <Reveal as="li" delay={0}>
            <a className="report-row" href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer">
              <span className="report-region">India</span>
              <span className="report-name">National Cyber Crime Reporting Portal</span>
              <span className="report-note">Helpline 1930</span>
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
          </Reveal>
          <Reveal as="li" delay={70}>
            <a className="report-row" href="https://reportfraud.ftc.gov" target="_blank" rel="noopener noreferrer">
              <span className="report-region">United States</span>
              <span className="report-name">ReportFraud.ftc.gov</span>
              <span className="report-note">Federal Trade Commission</span>
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
          </Reveal>
          <Reveal as="li" delay={140}>
            <div className="report-row report-row--static">
              <span className="report-region">Anywhere</span>
              <span className="report-name">Your bank’s fraud line</span>
              <span className="report-note">Number on the back of your card</span>
              <span />
            </div>
          </Reveal>
        </ul>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// About: the numbers count up as the section crosses the screen.
// ---------------------------------------------------------------------------

function About() {
  const ref = useScrub<HTMLElement>({ mode: 'view' })
  return (
    <section ref={ref} className="about" data-tone="ink" data-chapter="Why Cadence" aria-labelledby="about-title">
      <div className="wrap about-grid">
        <Reveal>
          <Slate index="About">Why Cadence</Slate>
          <h2 id="about-title" className="display section-title">
            Built on a simple belief: <em>calm beats clever.</em>
          </h2>
        </Reveal>
        <Reveal delay={100} className="about-copy">
          <p>
            Voice-cloning scams work because they hit us where we are least guarded, in a moment of love and fear. The answer isn’t to make everyone suspicious of everyone they love. It’s to make it easy and normal to pause.
          </p>
          <p>
            So Cadence is designed to be quiet, plain-spoken and on your side. It gives you a moment, a next step and the final say, and is honest about what it cannot know.
          </p>
        </Reveal>
      </div>
      <div className="wrap about-stats" style={vars({ '--c': 'clamp(0, calc((var(--p) - 0.22) / 0.3), 1)' })}>
        <div>
          <strong className="num num--3" aria-label="3">
            <span aria-hidden="true" />
          </strong>
          <span>beats: notice, pause, verify</span>
        </div>
        <div>
          <strong className="num num--90" aria-label="90 seconds">
            <span aria-hidden="true" />
            <em aria-hidden="true">s</em>
          </strong>
          <span>a pause most real emergencies survive</span>
        </div>
        <div>
          <strong className="num num--0" aria-label="0">
            <span aria-hidden="true" />
          </strong>
          <span>decisions made for you, ever</span>
        </div>
      </div>
    </section>
  )
}

export default function Help() {
  return (
    <>
      <PageHero
        reel="Reel V"
        name="Help"
        num="5"
        title={
          <>
            Questions, and what to do <em>if it happened.</em>
          </>
        }
        lead="Clear answers about how Cadence works, and a calm checklist for anyone who thinks they have already been called."
      />
      <Faq />
      <Targeted />
      <Report />
      <About />
      <CtaBand
        tone="paper"
        title={
          <>
            Easier to <em>say</em> than to read?
          </>
        }
        body="Tell the voice assistant what happened, in your own words. It will listen, and help you work out what to do next."
        to="/assistant"
        label="Talk to Cadence"
      />
    </>
  )
}
