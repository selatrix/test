# ink's rhythm site

Personal portfolio site with a rhythm-game aesthetic. Built with React + Vite + TypeScript + Tailwind + Framer Motion.

## Stack
- React 19 + TypeScript
- Vite (port 5000)
- Tailwind CSS v4
- Framer Motion
- React Router DOM

## Running
```
npm run dev
```

## Deploy (GitHub + Render)
- Push to GitHub
- On Render: New Web Service → connect repo → Build `npm install && npm run build` → Publish `dist/`
- Set root directory to `/`
- `/health` and `/ping` routes are available for uptime monitoring

## Structure
- `src/pages/` — Home, AboutMe, MyGames, Projects, HealthCheck
- `src/components/` — InkCharacter (manga outline character), Nav, BeatFlash, CustomCursor
- `src/hooks/useRhythmEngine.tsx` — BPM/beat context (140 BPM)
- `public/bg-music.mp3` — Background track

## User Preferences
- Minimal, clean, outline-only aesthetic
- No fills on character — stroke-based SVG manga/anime style
- No circles — rhythm game elements use brackets/lines/bars
- Rhythm-reactive: everything pulses/reacts to the beat engine
- Font: VT323 (pixel), Share Tech Mono (mono)
- Color: black bg, white strokes, #00ffff accent
- Name: ink (not tofu)
- Fully responsive for all devices (mobile + desktop)
