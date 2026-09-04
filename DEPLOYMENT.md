# Vercel deployment

The GitHub repository `brasileirodev/aoa-frontend-challenge` is intended to be
connected to the Vercel project `aoa-frontend-challenge`.

- Framework: Next.js.
- Root directory: repository root (`./`).
- Production branch: `main` (configured in Vercel, not in `vercel.json`).
- Install and build commands: `npm ci` and `npm run build`.
- Git deployments: enabled in `vercel.json`.

Merging a pull request into `main` updates that branch and triggers a production
deployment through Vercel's GitHub integration. Direct pushes to `main` also
trigger production deployments. Other branches receive preview deployments.
The configuration does not enforce a pull-request-only workflow; that requires
GitHub branch protection or rulesets. No GitHub Actions deployment workflow or
Vercel token in the repository is needed.

After import, verify the connected repository, Production branch, and first
successful deployment in the Vercel dashboard. The Git integration must remain
connected for automatic deployments to run.

Reference: https://vercel.com/docs/git/vercel-for-github
