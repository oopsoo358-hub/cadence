import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { CurtainProvider } from './components/Curtain'
import { SiteLayout } from './components/Shell'
import Assistant from './pages/Assistant'
import Help from './pages/Help'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import NotFound from './pages/NotFound'
import Playbook from './pages/Playbook'
import Privacy from './pages/Privacy'
import Threats from './pages/Threats'
import { PreviewVoiceProvider } from './voice/preview'

// The demo film is rendered from this route (see scripts/render-film.mjs). Dev only, so it never ships.
const Film = import.meta.env.DEV ? lazy(() => import('./film/Film')) : null

const TITLES: Record<string, string> = {
  '/': 'Cadence — Make room for a second thought',
  '/how-it-works': 'How it works — Cadence',
  '/threats': 'The threat — Cadence',
  '/playbook': 'Playbook — Cadence',
  '/privacy': 'Privacy & limits — Cadence',
  '/help': 'Help — Cadence',
  '/assistant': 'Voice assistant — Cadence',
}

function TitleManager() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.title = TITLES[pathname] ?? 'Page not found — Cadence'
  }, [pathname])
  return null
}

/*
 * INTEGRATION POINT
 * The voice assistant page only talks to a `VoiceSession` (src/voice/session.tsx).
 * Replace <PreviewVoiceProvider> below with the real provider to go live.
 */
export default function App() {
  return (
    <BrowserRouter>
      <CurtainProvider>
        <TitleManager />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="threats" element={<Threats />} />
            <Route path="playbook" element={<Playbook />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          {Film && (
            <Route
              path="__film"
              element={
                <Suspense fallback={null}>
                  <Film />
                </Suspense>
              }
            />
          )}
          <Route
            path="assistant"
            element={
              <PreviewVoiceProvider>
                <Assistant />
              </PreviewVoiceProvider>
            }
          />
        </Routes>
      </CurtainProvider>
    </BrowserRouter>
  )
}
