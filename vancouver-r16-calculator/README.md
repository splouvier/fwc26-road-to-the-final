# Road to BC Place — Canada × Portugal (July 7 R16 calculator)

An interactive World Cup 2026 probability calculator: how likely are Canada and
Portugal to meet in the Round-of-16 game in Vancouver on July 7, and what has to
happen for it. Built as a single self-contained HTML file — no build step, no
dependencies, runs entirely in the browser.

A seeded Monte Carlo (20,000 runs) recomputes the odds live as you toggle:
- Canada's June 24 result vs Switzerland
- Portugal's June 27 result vs Colombia
- how tough the mystery knockout opponent is

## Run locally
Just open `index.html` in any browser. That's it.

## Deploy on Vercel
This is a static site, so there's nothing to configure.

1. Push this folder to a GitHub repo (see below).
2. Go to https://vercel.com → **Add New → Project → Import** your repo.
3. Framework preset: **Other**. Leave build & output settings empty.
4. **Deploy.** Vercel serves `index.html` at the root.

## Updating the data
Open `index.html` and edit the plain objects near the top of the `<script>`
block: `STANDINGS` (current points / goals), `FIXTURES` (remaining games), and
`TEAMS` (strength ratings). The model re-bases itself automatically.

> Figures are modelled estimates — illustrative, not a guarantee. Not affiliated with FIFA.
