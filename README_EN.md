# AI Interview Platform · Frontend

[![简体中文](https://img.shields.io/badge/Language-简体中文-red)](./README.md)
[![English](https://img.shields.io/badge/Language-English-blue)](./README_EN.md)

Frontend of an LLM-powered AI interview system, supporting resume-based question prediction, technical interviews, and comprehensive (aptitude + HR) interviews.

The backend service lives in `ww-server` (NestJS + LangChain + MongoDB).

**Highlights**: token-by-token streaming of AI dialogue, interview state machine with resumable sessions, resume parsing and prediction result visualization.

## Project Architecture

### Tech Stack

- **Framework:** Nuxt 4, Vue 3, Vue Router 4
- **State Management:** Pinia + `pinia-plugin-persistedstate`
- **UI & Styling:** `@nuxt/ui`, TailwindCSS 4, Sass
- **Networking:** Nuxt plugin-based `$api` (`$fetch`) + SSE (`fetch + ReadableStream`)
- **Engineering:** Vite, Nitro, SVG Icons, Dayjs, local Dev Proxy

### Directory Structure

```text
.
├── app/                        # Frontend source (srcDir)
│   ├── api/                    # API layer by domain
│   ├── assets/                 # Static assets (css/images/icons)
│   ├── components/             # Shared + business components
│   │   ├── home/               # Homepage modules
│   │   ├── interview/          # Interview flow modules
│   │   ├── login/              # Login modules
│   │   └── profile/            # User center modules
│   ├── composables/            # Reusable composables (SEO/modal/speech)
│   ├── constants/              # Constants & business configs
│   ├── layouts/                # Layouts (default/auth/interview)
│   ├── middleware/             # Route middleware (auth)
│   ├── pages/                  # Route pages
│   ├── plugins/                # Nuxt plugins (request/analytics/svg)
│   ├── stores/                 # Pinia stores (user/interview/ui)
│   └── utils/                  # Utilities (speech optimization/rate-limit)
├── server/
│   └── api/                    # Nitro server APIs (e.g. dynamic sitemap)
├── public/                     # Public static assets
├── nuxt.config.js              # Nuxt/Nitro/Vite global config
└── ecosystem.config.js         # PM2 deployment config
```

### Core Design

#### 1) Route/Layout Separation

- `default`: marketing/site content (home, faq, contact, etc.)
- `auth`: isolated login experience
- `interview`: interview flow container (sidebar, step status, navigation guards)

#### 2) State-Driven Business Flow

- `stores/user.js`: login state, token, user profile, resumes
- `stores/interview.js`: 3-step interview flow, session messages, interview state machine
- `stores/ui.js`: global UI states (login prompt modal, etc.)

#### 3) Unified Request Layer

- `plugins/request.js` provides global `$api`
  - auto-injects token
  - unwraps backend `{ code, message, data }`
  - handles 401/500 + toast notifications
- standard HTTP APIs are under `app/api/*.js`
- SSE flows are handled by `ssePost` in `app/api/interview.js`

#### 4) Main Interview Flow

1. `/interview/start`: choose position + resume + service type
2. `/interview?serviceType=xxx&step=input|progress|interview|complete`: unified flow page
3. `step=progress`: resume quiz SSE progress
4. `step=interview`: real-time interview session (pause/resume/end)
5. `/interview/report`: final analysis report
6. `/history`: history replay (complete/report)

#### 5) Extended Capabilities

- SEO: global head in `nuxt.config.js` + `constants/seo.js` + `useSEO`
- Resume upload: file parsed to plain text in backend memory, no object storage required
- Speech: voice input optimization + AI speech playback

## Feature Matrix

### Implemented Features

- Authentication: email + password sign-up/sign-in, persistent login state, auth interception
- Marketing homepage: service cards, highlights, CTA modules
- Interview flow:
  - Step 1: position + resume selection (upload/text input)
  - Step 2: service entry (resume quiz / special interview / behavior+HR)
  - Step 3: result and report view
- Streaming capabilities:
  - SSE progress for resume quiz
  - SSE real-time Q&A for mock interviews
  - Voice input + speech playback
- History: record list, replay, and resume of unfinished sessions
- Profile center: user profile, resume management, consumption history, coin redemption
- Quota system: atomic usage deduction, automatic refund on failure, coin-based redemption

### Service Types

| Service | ID | Description |
| --- | --- | --- |
| Resume Quiz | `resume` | Predictive interview questions based on resume + JD |
| Special Interview | `special` | 1v1 real-time mock interview, supports pause/resume/end |
| Behavior + HR | `behavior` | Comprehensive behavior and HR-focused evaluation |

## API Integration Contract

### 1) Base URL and Proxy

- default API base path: `/dev-api`
- local dev routes through `nitro.devProxy` in `nuxt.config.js`
- production can override with `VITE_API_BASE_URL`

### 2) Auth Contract

- token is stored in `userStore.token`
- request plugin automatically injects:
  - `Authorization: Bearer <token>`
- when API returns 401, frontend clears login state and redirects user to login

### 3) Standard HTTP Response Shape

Backend recommended response:

```json
{
  "code": 200,
  "message": "ok",
  "data": {}
}
```

Frontend `$api` behavior:
- `code === 200`: auto-unwrap to `data`
- non-200: show toast and throw error

### 4) SSE Contract

- SSE does not use `$api`; it uses `fetch + ReadableStream` (see `app/api/interview.js`)
- common wrapper: `ssePost(path, params, options)`
- current SSE endpoints:
  - `POST /interview/resume/quiz/stream`
  - `POST /interview/mock/start`
  - `POST /interview/mock/answer`

### 5) API Layer by Domain

- `app/api/login.js`: login APIs
- `app/api/user.js`: user profile and history records
- `app/api/resume.js`: resume file upload & parsing
- `app/api/interview.js`: interview flow, history, unfinished sessions, SSE
- `app/api/admin.js`: admin helpers

## Run Locally

### 1) Requirements

- Node.js `>= 20` (LTS recommended)
- package manager: `pnpm` (recommended to match lockfile)

### 2) Install Dependencies

```bash
pnpm install
```

### 3) Start Development Server

```bash
pnpm dev
```

This command copies `.env.development` to `.env` and starts Nuxt dev mode.

### 4) Backend Proxy Setup (Important)

By default, `/dev-api/*` is proxied via `nitro.devProxy` in `nuxt.config.js`.
Update the proxy target to your backend address:

```js
// nuxt.config.js
nitro: {
	devProxy: {
		'/dev-api/': {
			target: 'http://localhost:8888',
			changeOrigin: true,
			rewrite: (p) => p.replace(/^\/dev-api/, '')
		}
	}
}
```

The backend service lives in the sibling directory `ww-server`; start it before running the frontend locally.

### 5) Environment Variables

Main variables used by `runtimeConfig.public` (see `nuxt.config.js`):

- `VITE_API_BASE_URL`: frontend API base path (default `/dev-api`)
- `VITE_RESUME_PREVIEW_URL`: resume preview site URL

Configure them in `.env.development` / `.env.production`.

### 6) Build & Preview (Production)

```bash
pnpm build
pnpm preview
```

Notes:
- `pnpm build` copies `.env.production` to `.env` before build
- `pnpm preview` serves the production build locally

### 7) Troubleshooting

- 401 errors: verify token state and backend auth config
- all API calls fail: verify `nitro.devProxy.target` availability
- SSE has no events: verify backend returns `text/event-stream` and proxy supports streaming
- upload failures: ensure the file is PDF/DOC/DOCX under 10MB; scanned PDFs have no extractable text

## Commit Convention

| Type | Description | Example |
| --- | --- | --- |
| **feat** | New feature | `feat(user): add login button` |
| **fix** | Bug fix | `fix(api): correct null pointer handling` |
| **docs** | Documentation only | `docs(readme): update installation steps` |
| **style** | Style-only change (formatting, spacing, etc.) | `style: format code with prettier` |
| **refactor** | Refactor without feature or bug fix | `refactor(component): simplify render logic` |
| **perf** | Performance improvement | `perf(list): improve rendering performance` |
| **test** | Tests only | `test(utils): add unit tests for parseDate` |
| **build** | Build system or dependency updates | `build(deps): upgrade vite to 5.x` |
| **ci** | CI/CD config changes | `ci(github): add lint workflow` |
| **chore** | Other non-source changes | `chore: update .gitignore` |
| **revert** | Revert a previous commit | `revert: revert "feat(user): add login button"` |

Additional notes:

- `scope` is optional and indicates impacted module/function
- keep commit title within ~50 chars when possible
- one commit should focus on one `type` for a clear history
