# Cadence

The front end for Cadence, a tool that helps people pause and verify when a familiar voice calls.

```
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, then a production build in dist/
npm test
```

## What is where

| Route | What it is |
| --- | --- |
| `/` | Opening titles (a pinned scene), the idea, **the film** (scroll plays it), three beats, the programme, voice teaser |
| `/how-it-works` | Four steps played on a phone, a signal fader, the anatomy of an alert, every screen on a horizontal strip |
| `/threats` | The script of a cloned-voice call as a film strip, why it works, red flags, a five-call quiz, myths |
| `/playbook` | Five habits beside a phone that follows them, a live safe-word generator, a readiness strip |
| `/privacy` | Consent played as a scene, will and won't, limits on two phones, the lifecycle of a call, accessibility |
| `/help` | Searchable FAQ, what to do if targeted, who to report to |
| `/assistant` | **The product.** The voice assistant, in the same black and white system. Its conversation is drawn as two sound tracks, YOU above and CADENCE below, scrolling past a playhead. Hand-off notes are in `src/voice/README.md` |

## How the site moves

Everything scroll-driven is written as CSS that reads one variable, `--p` (0 to 1).
`src/lib/scrub.ts` has a single shared scroll loop. `useScrub` writes `--p` on a section and never touches React state, so scrolling does not re-render anything.

- **Scene** (`components/motion.tsx`): a tall wrapper with a sticky stage. `--p` is how far through it you are.
- **Shot**: one layer of a scene. It dissolves in and out between two values of `--p`; once fully out it is switched off so the browser skips painting it.
- **StepScene**: copy on the left and a phone that plays through screens on the right. Used by *How it works* and *Help*.
- **HRail**: vertical scroll drives a horizontal track (the film strip, the screen gallery).
- **Timeline** (`components/Shell.tsx`): the bar at the bottom. The scrollbar is a playhead with a timecode, chapter marks and a chapter name; drag it or use the arrow keys.
- **Curtain** (`components/Curtain.tsx`): route changes close a pair of drapes on a title card. The first visit of a session opens the same curtain.
- With `prefers-reduced-motion` the pinned scenes become ordinary sections and every screen is shown in full.

### The phones

`components/devices.tsx` is a small library of realistic phone screens (incoming call, live call, alert, pause, verify, call-back, decide, consent, recents, messages, lock screen, settings, notes, trusted circle, report). Everything is sized in `em` and the phone sets its own font size from its width, so one screen works as a thumbnail or a full film frame.

### Colour

Black, white and greys only, everywhere, including the voice assistant. There is no accent colour: state is shown by inversion (a label or control that is on turns white with black text), by weight and by position.

## The film

`public/media/cadence-demo.mp4` (76 seconds, silent, with intertitles) and its poster are **rendered from the site itself**.
The film is a React composition (`src/film/Film.tsx`) in which one number, the time, decides every pixel.
`/__film?t=27` shows a moment and `/__film?play` plays it in a dev server. The route does not ship in production.

The encode uses a keyframe every three frames, so the page can scrub it smoothly with the scroll wheel. To render it again after changing a screen or a caption:

```
npm i --no-save puppeteer-core ffmpeg-static
npm run dev                # in another terminal
npm run film               # BASE=http://localhost:5173 if your port differs
```

See the header of `scripts/render-film.mjs` for options (size, quality, keyframe interval, reusing rendered frames).
