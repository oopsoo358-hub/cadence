import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Mark } from '../components/Mark'
import { TLink } from '../components/Nav'
import { LOCALES, VOICES, type CaptionSize } from '../voice/options'
import {
  Announcer,
  Dock,
  EndedPanel,
  ErrorPanel,
  IdlePanel,
  LiveCaptions,
  PHASE_COPY,
  SettingsDialog,
  StatesBar,
  TranscriptPanel,
  TypeBox,
  formatClock,
  isLive,
} from '../voice/parts'
import { useVoiceSession } from '../voice/session'
import { TrackCanvas } from '../voice/TrackCanvas'

const CONNECTION_LABEL = {
  online: 'Connected',
  connecting: 'Connecting',
  reconnecting: 'Reconnecting',
  offline: 'Offline',
} as const

export default function Assistant() {
  const session = useVoiceSession()
  const { phase, connection, muted, startedAt, endedAt, isPreview, actions, levels, textInput } = session

  // UI-only preferences. `locale` and `voiceId` are handed to `actions.start()`.
  const [captionsOn, setCaptionsOn] = useState(true)
  const [transcriptOpen, setTranscriptOpen] = useState(false)
  const [typeOpen, setTypeOpen] = useState(false)
  const [captionSize, setCaptionSize] = useState<CaptionSize>('md')
  const [locale, setLocale] = useState<string>(LOCALES[0].id)
  const [voiceId, setVoiceId] = useState<string>(VOICES[0].id)
  const [volume, setVolume] = useState(0.85)

  const live = isLive(phase)

  // Clock
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!startedAt || endedAt) return
    const id = window.setInterval(() => setNow(Date.now()), 500)
    return () => window.clearInterval(id)
  }, [startedAt, endedAt])
  const elapsed = startedAt ? (endedAt ?? now) - startedAt : 0

  const start = useCallback(() => actions.start({ locale, voiceId, bargeIn: true }), [actions, locale, voiceId])

  const onVolume = (v: number) => {
    setVolume(v)
    actions.setOutputVolume(v)
  }

  useEffect(() => {
    actions.setOutputVolume(volume)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keyboard shortcuts (ignored while typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)) return
      if (document.querySelector('[role="dialog"]')) return
      const k = e.key.toLowerCase()
      if (k === 'm' && live) actions.setMuted(!muted)
      else if (k === 'c') setCaptionsOn((v) => !v)
      else if (k === 't') setTranscriptOpen((v) => !v)
      else if (k === 's' && phase === 'speaking') actions.interrupt()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [actions, live, muted, phase])

  // The call page takes over the whole viewport and hides the site's scroll chrome.
  useLayoutEffect(() => {
    document.documentElement.classList.add('is-call')
    return () => document.documentElement.classList.remove('is-call')
  }, [])

  const settled = phase === 'idle' || phase === 'ended' || phase === 'error'
  const stateLabel = muted && phase === 'listening' ? 'Muted' : PHASE_COPY[phase].label

  // The slate above the tracks says whether the microphone is on, and how long the call has run.
  const micLabel =
    phase === 'ended'
      ? 'Call ended'
      : phase === 'error' || phase === 'idle' || phase === 'requesting-mic'
        ? 'Microphone off'
        : muted
          ? 'Microphone muted'
          : 'Microphone on'
  const showClock = !!startedAt && (live || phase === 'ended')

  return (
    <div className={`va va--${phase}`} data-tone="ink" data-speaker={phase === 'speaking' ? 'ai' : phase === 'user-speaking' ? 'you' : 'none'}>
      <Announcer session={session} />

      <header className="va-bar">
        <TLink to="/" className="va-back">
          <ArrowLeft size={17} aria-hidden="true" />
          <span>Back to site</span>
        </TLink>

        <div className="va-brand">
          <Mark size={20} />
          <span>cadence</span>
          <em>Voice</em>
        </div>

        <div className="va-bar-right">
          {isPreview && (
            <span className="va-note" title="The page is showing a scripted sample conversation">
              Preview, scripted sample
            </span>
          )}
          {phase !== 'idle' && phase !== 'error' && <span className="va-conn">{CONNECTION_LABEL[connection]}</span>}
          <SettingsDialog
            locale={locale}
            onLocale={setLocale}
            voiceId={voiceId}
            onVoice={setVoiceId}
            captionSize={captionSize}
            onCaptionSize={setCaptionSize}
            live={live}
          />
        </div>
      </header>

      <div className={`va-body${transcriptOpen ? ' has-transcript' : ''}`}>
        <main className="va-stage" id="main">
          <p className="slate va-slate">
            <span>{micLabel}</span>
            {showClock && (
              <span className="slate-index" aria-label="Call length">
                TC {formatClock(elapsed)}
              </span>
            )}
          </p>

          {!settled && (
            <p className="va-state" aria-hidden="true">
              {stateLabel}
              <span>.</span>
            </p>
          )}
          {!settled && <h1 className="sr-only">Voice assistant</h1>}

          <div className="va-tracks">
            <TrackCanvas phase={phase} muted={muted} levels={levels} />
            <span className="va-lane va-lane--you" aria-hidden="true">
              You
            </span>
            <span className="va-lane va-lane--ai" aria-hidden="true">
              Cadence
            </span>
          </div>

          <div className="va-under">
            {phase === 'idle' && <IdlePanel onStart={start} />}
            {phase === 'ended' && <EndedPanel session={session} onAgain={() => { actions.reset(); start() }} />}
            {phase === 'error' && <ErrorPanel session={session} onRetry={() => { actions.reset(); start() }} />}
            {!settled && <LiveCaptions session={session} size={captionSize} show={captionsOn} />}
          </div>
        </main>

        <TranscriptPanel session={session} open={transcriptOpen} onClose={() => setTranscriptOpen(false)} />
      </div>

      {live && (
        <div className="va-foot">
          {typeOpen && textInput && <TypeBox onSend={actions.sendText} />}
          <Dock
            session={session}
            captionsOn={captionsOn}
            onCaptions={() => setCaptionsOn((v) => !v)}
            transcriptOpen={transcriptOpen}
            onTranscript={() => setTranscriptOpen((v) => !v)}
            typeOpen={typeOpen}
            onType={() => setTypeOpen((v) => !v)}
            volume={volume}
            onVolume={onVolume}
          />
        </div>
      )}

      <StatesBar session={session} />
    </div>
  )
}
