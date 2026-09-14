# Nesto

A single-page app where clients compare today's best fixed and variable mortgage rates, start an application for the product they pick, and keep the applicant's contact information up to date.

Built for the nesto front-end coding challenge. The original brief is kept in [CHALLENGE.md](CHALLENGE.md).

**Live demo: [nesto.alipajand.com](https://nesto.alipajand.com)**

## Getting started

Requires Node.js 22.22 or later.

```bash
npm install
npm run dev
```

The app runs on http://localhost:5173 and talks to the exam API directly.

## Scripts

| Command                   | Description                                       |
| ------------------------- | ------------------------------------------------- |
| `npm run dev`             | Start the development server                      |
| `npm run build`           | Build for production into `dist/`                 |
| `npm start`               | Serve the production build locally                |
| `npm run lint`            | Type-check and lint the code                      |
| `npm test`                | Run the tests                                     |
| `npm run storybook`       | Start Storybook on http://localhost:6006          |
| `npm run build-storybook` | Build a static Storybook into `storybook-static/` |

## Features

### 1. Best rates (`/`)

- Two lists, one per mortgage type, with the product(s) that have the lowest `bestRate`. If several products share the lowest rate, they are all listed.
- Selecting a product creates an application and opens it. The button shows progress and the other buttons are disabled meanwhile, so a double click can't create two applications. If creation fails, a notification explains why and the client stays on the page to try again.

### 2. Complete the application (`/applications/:id`)

- Contact form for the main applicant: first name, last name, email and phone number.
- Fields are validated when leaving them, then as the client types. Submitting an invalid form moves focus to the first field that needs attention.
- Saving gives feedback in several places, so it can't be missed:
  - the button shows a spinner while the request is in flight,
  - a notification confirms **Application saved** (first save) or **Application updated** (later saves),
  - "Saved at 2:14 p.m." appears next to the button, and turns into "Unsaved changes" as soon as something is edited,
  - the status badge switches from _Incomplete_ to _Complete_, and a message links to the list of applications.
- If saving fails, the values stay in the form and an inline message explains what happened.

### 3. Applications (`/applications`)

- Lists the applications whose main applicant has a valid first name, last name, email and phone number, newest first.

## Tech stack

| Area         | Choice                       | Why                                                                                                  |
| ------------ | ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| UI           | React 19, TypeScript         | Types for the API contract catch mistakes at build time.                                             |
| Build        | Vite 8                       | Fast dev server and builds.                                                                          |
| Routing      | React Router 8               | Nested layout, error boundaries, scroll restoration.                                                 |
| Server state | TanStack Query               | Caching, retries, request cancellation and cache updates after saving, without hand-written effects. |
| Forms        | React Hook Form + Zod        | One validation schema is shared by the form and the applications list.                               |
| Styling      | Plain CSS                    | No UI or CSS framework, as requested: design tokens, nesting, subgrid and container queries.         |
| Tests        | Vitest, Testing Library, MSW | Tests exercise the app like a user would, against a mock of the API at the network level.            |
| Components   | Storybook 10                 | Components in their different states, with an accessibility panel.                                   |
| Linting      | oxlint                       | Fast linting with its default rules.                                                                 |

## Project structure

```
src/
├── api/            HTTP client, error handling, endpoints and API types
├── app/            Providers and routes
├── components/     Shared UI and the app layout: Button, TextField, Toast, Header, …
├── features/
│   ├── products/       Best-product selection, product card, lists
│   └── applications/   Applicant rules, contact form, table, queries
├── lib/            Formatting helpers
├── pages/          One component per route
├── styles/         Tokens, base, layout, components and pages stylesheets
└── test/           Test setup, fixtures, mock API, render helpers
```

Tests and stories sit next to the code they cover. Pages compose features; features use the shared components; nothing in `components/` knows about the API.

## Deployment

The app is deployed on Vercel at **https://nesto.alipajand.com**.

The build output is a static single-page app in `dist/`. `vercel.json` sends every route to `index.html`, so deep links such as `/applications` work when opened directly.

To deploy it yourself on Vercel, import the repository (the Vite preset is detected with its defaults: build command `vite build`, output directory `dist`) or run `npx vercel --prod`. `VITE_CANDIDATE_NAME` can be set in the project's environment variables. The custom domain is added under the project's **Settings → Domains**, with a `CNAME` record for `nesto` pointing to Vercel.

Any static host works the same way, as long as unknown paths fall back to `index.html`.

## What I would do next

- Warn before leaving the form with unsaved changes.
- Browser end-to-end tests with Playwright, and visual regression tests on the stories.
- Report unexpected errors to a monitoring service instead of the console.
- Search, sorting and pagination on the applications list once there are more than a handful.
- Let clients change the selected product from the application page.
