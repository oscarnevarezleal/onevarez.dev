# onevarez.dev

Builder profile for Oscar Nevarez: what I've shipped, what's running in production, and the stack behind it. The companion site [onevarez.com](https://onevarez.com) covers consulting and services.

## How it works

- `content/profile.json` is the single source of truth. It follows the [JSON Resume](https://jsonresume.org/schema) schema, plus an `x-builder` block for builder-only bits (headline, "building now", stats).
- `scripts/build.mjs` renders it into `index.html`. No dependencies.
- `styles.css` and `assets/app.js` add the **onevarez.swf** experience: a Flash-style preloader with SKIP INTRO, a particle headline that reacts to the cursor, and the projects reel driven by a Flash IDE-style timeline (scroll, drag the playhead or click a keyframe).
- Without JS, or with reduced motion turned on, the page is plain readable HTML: no preloader, no particles, and the reel becomes a swipeable row.

```sh
node scripts/build.mjs          # regenerate index.html after editing the JSON
python3 -m http.server 8000     # preview at http://localhost:8000
```

`index.html` is committed, so any static host (Vercel, GitHub Pages, Cloudflare Pages) can serve the repo root with no build step.

## Google Analytics

The `onevarez.dev` Google Analytics account and GA4 property use web stream `16176789185` and measurement ID `G-8S0YFHPWV4`. Reporting uses Mexico City time. Optional account data sharing is disabled; enhanced measurement is enabled.

The Google tag is emitted by `scripts/build.mjs` and committed in `index.html`. It loads only on `onevarez.dev` and `www.onevarez.dev`, keeping local and deployment previews out of production reports. After deployment, visit the site and check Analytics Realtime to verify collection. Update the measurement ID in the generator and rebuild if the stream changes.

## Merging with onevarez.com later

The profile data is kept in JSON Resume shape on purpose, so it lines up with [`resume.json`](https://github.com/oscarnevarezleal/resume) and can be dropped into the .com site as a `/builder` (or `/work`) section. Standard keys (`basics`, `work`, `projects`, `skills`, `publications`) carry over as-is; anything under `x-builder` is optional. See [`docs/onevarez-com-proposal.md`](docs/onevarez-com-proposal.md) for the proposed .com changes.
