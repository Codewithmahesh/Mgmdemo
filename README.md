# Exponentor demo opening

The animated opener for the MGM Online Examination Portal demo (Next.js 16, App Router, TypeScript).
Arena, Studio and Pocket as a row, then a cube, then six manual exam steps, then the portal smashes them and "One platform." fills the screen.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000, for editing
npm run present    # production build + local server, for the day
```

`npm run build` writes a static site to `out/`. Upload that folder to any static host (Vercel, Netlify, GitHub Pages) or keep it on a USB drive and run `npx serve out`.
`offline/exponentor-demo-opening.html` is the same opener as a single file that opens by double-click, as a backup.

## Keys

| Key | Does |
| --- | --- |
| Space, Enter, Right arrow | Next beat. Nine presses in all; the tenth (Enter) opens the portal. |
| Left arrow, Backspace | One step back |
| R | Replay from the title |
| F | Fullscreen |
| M | Sound on or off |

Presses 1-3 reveal Arena, Studio, Pocket. 4-6 fold them into a cube and turn it. 7 spins it. 8 lands the six manual steps, which then wait. 9 drops the portal. Enter opens the portal.

## Edit

- `lib/content.ts`: the three names and lines, the six old-step labels, animation speed (`PACE`).
- `.env.local`: `NEXT_PUBLIC_PORTAL_URL` (default `https://test.exponentor.com`). See `.env.example`.
- `components/Scene.tsx`: page markup and the replica of the portal landing page.
- `components/OldCards.tsx`: the six old paper cards.
- `lib/opening.ts`: the timeline. `lib/sfx.ts`: sounds. `lib/scraps.ts`: the paper pieces.
- `app/globals.css`: all styling, with the portal's colours and fonts.
