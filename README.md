# Ziki: "Is my product still OK?" (mock-up)

A front-end-only mock-up of [Ziki](https://ziki.dev) with fake data. There's no backend, database, sign-in or environment variables.

- **First commit:** a faithful copy of Ziki's current screens.
- **Second commit:** an interaction proposal for the project owner.

The proposal is explained in [EXPLANATION.md](EXPLANATION.md).

| Page | What it is |
| --- | --- |
| `/dashboard` | **New:** the owner's home: verdict, what needs you, what's being watched, and undo |
| `/settings/shipping` | **New:** what agents may ship alone, the safety net, lessons, and how you hear about it |
| `/about` | **New:** the explainer video (for a 5-year-old) and the explanation, rendered from `EXPLANATION.md` |
| `/dashboard/today` | Ziki's dashboard as it is today, for comparison |
| `/issues` | Product: the Inbox and the Open / In progress / Done / All lists |
| `/issues/144` | An issue page (other issue numbers work too) |
| `/issues/new` | Report an issue |
| `/workers` | Ranking |
| `/marketing`, `/security` | "Coming soon", as in Ziki today |

## Run it locally

Needs Node 20 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

On a connection with flaky IPv6 (e.g. Starlink), put `NODE_OPTIONS=--dns-result-order=ipv4first` in front of the npm and npx commands.

## Deploy to Vercel

1. Install and sign in, once:
   ```bash
   npm i -g vercel
   vercel login
   ```
2. From this folder, deploy:
   ```bash
   vercel --prod
   ```
   Accept the defaults. Vercel detects Next.js; there are no environment variables to set.

Or push the repo to GitHub and import it at https://vercel.com/new.

The video is made by `video/make_video.py` from `video/script.json` (drawings in Pillow, Windows' Zira voice, ffmpeg).

Built with Next.js 15 and Tailwind CSS 4, using Ziki's own colour tokens and the Inter font.
