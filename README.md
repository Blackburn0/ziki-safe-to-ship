# Ziki: "Is my product still OK?" (mock-up)

A front-end-only mock-up of [Ziki](https://ziki.dev) with fake data. There's no backend, database, sign-in or environment variables.

- **First commit:** a faithful copy of Ziki's current screens.
- **Then:** an interaction proposal, the Inbox's "Needs your call" list.

The proposal is explained in [EXPLANATION.md](EXPLANATION.md).

| Page | What it is |
| --- | --- |
| `/issues` | Product → Inbox → **Needs your call** (new): 200 items that need a person, one line each, with bulk actions |
| `/about` | **New:** the short explanation, rendered from `EXPLANATION.md` |
| `/dashboard` | Ziki's dashboard as it is today |
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

Built with Next.js 15 and Tailwind CSS 4, using Ziki's own colour tokens and the Inter font.
