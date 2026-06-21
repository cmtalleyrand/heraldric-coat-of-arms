# Heraldic Coat of Arms Studio

A static, dependency-free studio for composing heraldic arms — from a single
charge on a plain field up to deeply marshalled achievements like the arms of
Charles V (quarterings nested several levels deep, field variations, ordinaries,
inescutcheons and enté-en-point).

## How it works

A coat of arms is a **recursive tree of regions**. Every node is either:

- a **leaf**: a field (`plain` / `paly` / `barry` / `bendy` / `chequy` / `semy`)
  with optional ordinaries and charges; or
- a **marshalling** node: a partition (`perPale`, `perFess`, `quarterly`,
  `perSaltire`, `perBend`, `perChevron`, `ente`, `grid`) whose parts are
  themselves full nodes.

Any node may also carry an **inescutcheon**. This single schema is what the
freeform editor edits and what the renderer walks — Charles V is just the schema
exercised deeply, not a special case.

The rendering engine (shield geometry, tincture palette, charge placement) is
adapted from [Armoria](https://github.com/Azgaar/Armoria) (MIT), with a recursive
marshalling layer added on top.

## Charge artwork & licensing

Charge SVGs are vendored from Armoria. Simple charges are **CC0**; the complex
charges originate from [WappenWiki](http://wappenwiki.org) under
**CC BY-NC(-SA) 3.0 — non-commercial use only**. See [`NOTICE.md`](NOTICE.md) for
the per-charge breakdown and attribution.

## Local development

```bash
npm test        # engine + build tests
npm run build   # static build into dist/
```

Open `index.html` directly for a quick look, or serve `dist/` after a build.

## Deployment

A GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) tests, builds,
and deploys to GitHub Pages on pushes to `main`. The build stamps a content-hash
`?v=` onto every script/stylesheet so a deploy always reaches every browser
(including Chrome for Android, which otherwise serves a cached bundle).
