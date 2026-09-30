# Voice assistant: front end handoff

The assistant page (`/assistant`) is pure presentation. It renders a `VoiceSession`
and calls its `actions`. It has **no audio, networking or AI code**.

## Plugging in the real service

1. Build a provider that puts a `VoiceSession` into `VoiceSessionContext`
   (`session.tsx` documents every field; `preview.tsx` is a complete working example).
2. In `src/App.tsx`, replace `<PreviewVoiceProvider>` with yours.
3. Set `isPreview: false` so the "Preview, scripted sample" note disappears.
4. Delete `preview.tsx` (and the `debug` field it provides).

## What the page gives you

| Page event | Arrives as |
| --- | --- |
| Start pressed | `actions.start({ locale, voiceId, bargeIn })` (inside the click handler, so audio can be unlocked) |
| End pressed | `actions.end()` |
| Mute toggled (button or `M`) | `actions.setMuted(boolean)` |
| Stop talking (button or `S`) | `actions.interrupt()` |
| Message typed | `actions.sendText(text)`; append the user turn to `turns` yourself |
| Volume slider | `actions.setOutputVolume(0..1)` |
| Try again / Talk again | `actions.reset()` then `actions.start(...)` |

## What the page needs from you

- `phase`: one of `VoicePhase` in `types.ts`. The two tracks, captions, dock and panels all follow it.
- `turns`: `TranscriptTurn[]`. `text` is the **full text so far** of each turn (never a delta); set `final: true` when done, `interrupted: true` if cut off.
- `levels`: a ref to `{ input, output }` (0..1). **Mutate it in place at 20-60 Hz.** The tracks (`TrackCanvas.tsx`) read it every animation frame, so never mirror it into React state.
- `connection`, `error`, `micPermission`, `muted`, `startedAt`, `endedAt`, `endReason`, `textInput`: see `session.tsx`.

## Language and voice lists

`options.ts` holds the locale and voice choices shown in Settings. Edit it to match
what the service supports.

## Reviewing every UI state without a backend

In dev (or with `?states` on the URL) a small "UI states" pill appears bottom-left.
It jumps the preview session to any phase or error so each state can be reviewed.
The pill only appears when the session provides `debug`, so it disappears with the preview.

## Accessibility notes

- Only *finished* turns and major state changes are announced to screen readers (`Announcer` in `parts.tsx`); the word-by-word captions are not live regions.
- Keyboard: `M` mute, `C` captions, `T` transcript, `S` stop talking. Ignored while typing or when a dialog is open.
- Motion respects `prefers-reduced-motion`.
