# onevarez.dev

Builder profile for Oscar Nevarez: what I've shipped, what's running in production, and the stack behind it. The companion site [onevarez.com](https://onevarez.com) covers consulting and services.

## How it works

- `content/profile.json` is the single source of truth. It follows the [JSON Resume](https://jsonresume.org/schema) schema, plus an `x-builder` block for builder-only bits (headline, "building now", stats).
- `scripts/build.mjs` renders it into `index.html`. No dependencies.
- `styles.css` holds all styling, with light and dark themes.

```sh
node scripts/build.mjs          # regenerate index.html after editing the JSON
python3 -m http.server 8000     # preview at http://localhost:8000
```

`index.html` is committed, so any static host (Vercel, GitHub Pages, Cloudflare Pages) can serve the repo root with no build step.

## Merging with onevarez.com later

The profile data is kept in JSON Resume shape on purpose, so it lines up with [`resume.json`](https://github.com/oscarnevarezleal/resume) and can be dropped into the .com site as a `/builder` (or `/work`) section. Standard keys (`basics`, `work`, `projects`, `skills`, `publications`) carry over as-is; anything under `x-builder` is optional. See [`docs/onevarez-com-proposal.md`](docs/onevarez-com-proposal.md) for the proposed .com changes.
