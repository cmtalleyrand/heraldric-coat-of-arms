# Heraldric Coat of Arms

A static medieval-style heraldry studio for composing a coat of arms from historically inspired tinctures, ordinaries, charges, layouts, and a motto.

## Local development

```bash
npm test
npm run build
```

Open `index.html` directly for quick local viewing, or serve `dist/` after a build.

## GitHub Pages deployment

The repository includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`. It tests the app, builds the static files into `dist/`, uploads the artifact, and deploys it to GitHub Pages on pushes to `main`, `master`, or `work`, or from a manual workflow dispatch.

To make the deploy button appear in GitHub:

1. Merge the workflow file into the repository's default branch. GitHub only lists manual `workflow_dispatch` actions after the workflow exists on the default branch.
2. In GitHub, open **Settings → Pages**.
3. Set **Build and deployment → Source** to **GitHub Actions**.
4. Open **Actions → Deploy to GitHub Pages → Run workflow**.

Pushing to `main`, `master`, or `work` also runs the same deployment pipeline automatically.
