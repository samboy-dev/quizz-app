# QuizBlitz — Project Context

> This file is the single source of truth for any AI model, developer, or tool
> picking up this codebase. Read it fully before making any changes.

---

## 1. What This Project Is

**QuizBlitz** is a Kahoot-style real-time quiz application built with Angular 21
and Firebase Firestore. It has three distinct functional modules:

- **User Module** — participants join a quiz by PIN, register their name/phone,
  answer questions one at a time with no going back, and see their final score.
- **Admin Module** — a protected panel where an admin creates quizzes, manages
  questions, assigns PINs, controls quiz status, and monitors live participation.
- **Ranking Module** — a visual leaderboard showing a podium for the top 3
  and a full animated bracket-style bar chart for all participants ranked by score.

**Scoring is based on correct answers only.** Speed/time bonuses are explicitly
out of scope for the current version (deferred to a future iteration).

**The bracket is decorative**, not a real elimination tournament. It's a ranked
visual arranged to look like a bracket/podium after everyone has answered.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Angular | 21.2.x |
| State Management | NGXS | 21.0.x |
| Backend / Database | Firebase Firestore | firebase SDK 12.x |
| Hosting | Firebase Hosting | — |
| Language | TypeScript | 5.9.x |
| Styles | SCSS (global, no CSS Modules) | — |
| Module system | NgModule-based (NOT standalone) | — |

### Critical Architecture Note — NgModule vs Standalone
Angular 21 generates standalone components by default, but **this project is
NgModule-based** (`--standalone=false` was used at project creation). Every
component and pipe in this project **must have `standalone: false`** in its
decorator. This was a deliberate choice for compatibility with NGXS and the
existing module structure. Do not convert components to standalone without
refactoring the entire module graph.

---

## 3. Project Directory Structure

```
quizapp/
├── src/
│   ├── app/
│   │   ├── app.ts                        # Root component (standalone: false)
│   │   ├── app.html                      # <router-outlet> only
│   │   ├── app-module.ts                 # Root NgModule, NGXS setup, Firebase init
│   │   ├── app-routing-module.ts         # Lazy-loads user/admin/ranking modules
│   │   │
│   │   ├── user/                         # User feature module
│   │   │   ├── user-module.ts
│   │   │   ├── user-routing-module.ts
│   │   │   ├── pin-entry/                # Route: /
│   │   │   ├── register/                 # Route: /register
│   │   │   ├── question/                 # Route: /question  (guarded: SessionGuard)
│   │   │   └── result/                   # Route: /result    (guarded: SessionGuard)
│   │   │
│   │   ├── admin/                        # Admin feature module
│   │   │   ├── admin-module.ts
│   │   │   ├── admin-routing-module.ts
│   │   │   ├── login/                    # Route: /admin/login
│   │   │   ├── dashboard/                # Route: /admin       (guarded: AdminGuard)
│   │   │   ├── quiz-manage/              # Route: /admin/quiz/:id
│   │   │   └── live-monitor/             # Route: /admin/monitor/:id
│   │   │
│   │   ├── ranking/                      # Ranking feature module
│   │   │   ├── ranking-module.ts
│   │   │   ├── ranking-routing-module.ts
│   │   │   └── bracket/                  # Route: /ranking/:quizId
│   │   │
│   │   ├── core/
│   │   │   ├── models/index.ts           # All TypeScript interfaces
│   │   │   ├── tokens.ts                 # DI tokens: FIREBASE_APP_TOKEN, FIRESTORE_TOKEN
│   │   │   ├── services/
│   │   │   │   ├── quiz.ts               # All Firestore CRUD operations
│   │   │   │   └── auth.ts               # Admin sessionStorage auth
│   │   │   └── guards/
│   │   │       ├── admin-guard.ts        # Checks AdminState.isAuthenticated
│   │   │       └── session-guard.ts      # Checks SessionState.session
│   │   │
│   │   ├── shared/
│   │   │   ├── shared-module.ts
│   │   │   └── pipes/
│   │   │       ├── completed-count.pipe.ts   # counts sessions with completedAt set
│   │   │       └── avg-score.pipe.ts         # calculates % average score
│   │   │
│   │   └── store/                        # All NGXS state and actions
│   │       ├── app.state.ts              # Barrel re-export of all states
│   │       ├── quiz.state.ts / quiz.actions.ts
│   │       ├── session.state.ts / session.actions.ts
│   │       ├── admin.state.ts / admin.actions.ts
│   │       └── ranking.state.ts / ranking.actions.ts
│   │
│   ├── environments/
│   │   ├── environment.ts                # Dev config (Firebase keys go here)
│   │   └── environment.prod.ts           # Prod config
│   │
│   └── styles.scss                       # Global design system (CSS variables, all shared classes)
│
├── SETUP.md                              # Firebase setup and deployment instructions
├── CONTEXT.md                            # This file
└── firebase.json                         # Firebase Hosting config (SPA rewrite)
```

---

## 4. Data Models (`src/app/core/models/index.ts`)

```typescript
interface Option {
  id: string;       // 'a' | 'b' | 'c' | 'd'
  text: string;
}

interface Question {
  id?: string;            // Firestore document ID
  text: string;
  options: Option[];      // Always exactly 4 options
  correctOptionId: string; // Must match one of options[].id
  order: number;          // Used for ordering via Firestore orderBy('order')
}

interface Quiz {
  id?: string;
  title: string;
  pin: string;            // The code users enter to join; must be unique
  status: 'waiting' | 'active' | 'finished';
  createdAt: Date | any;
  questionCount?: number; // Optional, not always populated
}

interface UserSession {
  id?: string;
  quizId: string;
  name: string;
  phone: string;
  score: number;          // Count of correct answers; updated live as user answers
  totalQuestions: number; // Snapshot at session creation time
  joinedAt: Date | any;
  completedAt?: Date | any; // Set when CompleteSession action fires
  answers?: UserAnswer[]; // Not stored on session doc; lives in subcollection
}

interface UserAnswer {
  id?: string;
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

interface BracketNode {
  rank: number;
  name: string;
  score: number;
  totalQuestions: number;
  children?: BracketNode[]; // Reserved for future tree expansion; not used currently
}
```

---

## 5. Firestore Database Schema

```
quizzes/                          (collection)
  {quizId}/                       (document)
    title: string
    pin: string
    status: 'waiting'|'active'|'finished'
    createdAt: Timestamp

    questions/                    (subcollection)
      {questionId}/               (document)
        text: string
        order: number
        options: Array<{id, text}>
        correctOptionId: string

sessions/                         (collection)
  {sessionId}/                    (document)
    quizId: string
    name: string
    phone: string
    score: number
    totalQuestions: number
    joinedAt: Timestamp
    completedAt?: Timestamp

    answers/                      (subcollection)
      {answerId}/                 (document)
        questionId: string
        selectedOptionId: string
        isCorrect: boolean
```

**Important query patterns used:**
- `where('pin', '==', pin)` — to look up quiz by PIN (pin-entry flow)
- `where('quizId', '==', quizId)` — to get all sessions for a quiz (ranking/monitor)
- `orderBy('order')` — to load questions in correct sequence

---

## 6. NGXS State Architecture

### QuizState (`store/quiz.state.ts`)
**Responsibility:** Active quiz data and question navigation during a user session.

| Property | Type | Purpose |
|---|---|---|
| `activeQuiz` | `Quiz \| null` | The quiz loaded by PIN |
| `questions` | `Question[]` | All questions for the active quiz |
| `currentIndex` | `number` | Index of the current question being shown |
| `loading` | `boolean` | True while Firestore calls are in flight |
| `error` | `string \| null` | PIN error messages shown to user |

**Key selectors:** `activeQuiz`, `currentQuestion`, `isLastQuestion`, `progress` (0–100)

**Actions:**
- `LoadQuizByPin(pin)` — queries Firestore, rejects if not found or status=finished
- `LoadQuestions(quizId)` — fetches ordered questions subcollection
- `NextQuestion` — increments currentIndex (no-op if already last)
- `ResetQuiz` — clears all state (called on returning to home)

---

### SessionState (`store/session.state.ts`)
**Responsibility:** The current user's participation in a quiz.

| Property | Type | Purpose |
|---|---|---|
| `session` | `UserSession \| null` | User's session document (id assigned after Firestore write) |
| `answers` | `UserAnswer[]` | In-memory list of all submitted answers |
| `completed` | `boolean` | True after CompleteSession fires |

**Key selectors:** `session`, `score` (computed from answers array in memory), `completed`

**Actions:**
- `CreateSession(quizId, name, phone, totalQuestions)` — writes to Firestore, stores id in state
- `SubmitAnswer(answer)` — writes to answers subcollection, updates score in state
- `CompleteSession` — writes completedAt + final score to session doc
- `ResetSession` — clears all state

**Important:** `score` is a computed selector (`answers.filter(a => a.isCorrect).length`),
not a stored field. The Firestore `score` field is only written on `CompleteSession`.

---

### AdminState (`store/admin.state.ts`)
**Responsibility:** Admin authentication and all CRUD operations.

| Property | Type | Purpose |
|---|---|---|
| `isAuthenticated` | `boolean` | Set by AdminLogin, checked by AdminGuard |
| `quizzes` | `Quiz[]` | All quizzes, reloaded after every mutation |
| `activeQuizId` | `string \| null` | Currently selected quiz in quiz-manage |
| `questions` | `Question[]` | Questions for activeQuizId |
| `participants` | `UserSession[]` | Live participants for monitor view |
| `loading` | `boolean` | |
| `error` | `string \| null` | Login error message |

**Actions:** `AdminLogin`, `AdminLogout`, `LoadAllQuizzes`, `CreateQuiz`, `UpdateQuiz`,
`DeleteQuiz`, `LoadAdminQuestions`, `CreateQuestion`, `UpdateQuestion`, `DeleteQuestion`,
`LoadLiveParticipants`, `SetQuizStatus`

---

### RankingState (`store/ranking.state.ts`)
**Responsibility:** Sorted participant list for the ranking/bracket view.

| Property | Type | Purpose |
|---|---|---|
| `participants` | `UserSession[]` | Sorted descending by score |
| `bracket` | `BracketNode[]` | Flat ranked list mapped from participants |
| `loading` | `boolean` | |

**Actions:** `LoadRankings(quizId)`, `ResetRankings`

`buildBracket()` is a private method that maps sorted participants to `BracketNode[]`.
Currently flat (rank 1 through N). The `children` field on `BracketNode` is reserved
for future bracket expansion.

---

## 7. Firebase Integration Pattern

Firebase is initialized **once** in `app-module.ts` using the plain `firebase` SDK
(not AngularFire's `provideFirebaseApp`/`provideFirestore`, which caused version
conflicts). The Firestore instance is provided via Angular DI tokens:

```typescript
// src/app/core/tokens.ts
export const FIREBASE_APP_TOKEN = new InjectionToken<any>('FIREBASE_APP');
export const FIRESTORE_TOKEN = new InjectionToken<Firestore>('FIRESTORE');

// src/app/app-module.ts
const app = initializeApp(environment.firebase);
providers: [
  { provide: FIREBASE_APP_TOKEN, useValue: app },
  { provide: FIRESTORE_TOKEN, useValue: getFirestore(app) },
]
```

`QuizService` injects `FIRESTORE_TOKEN` directly:
```typescript
constructor(@Inject(FIRESTORE_TOKEN) private firestore: Firestore) {}
```

**Do not switch to AngularFire's module-based providers** without resolving the
peer dependency conflict between `@angular/fire@20` and `@angular/core@21`.

---

## 8. Authentication

Admin auth is **not Firebase Auth** — it uses hardcoded credentials from
`environment.ts` validated in `AuthService`, with a sessionStorage flag
(`quizapp_admin = 'true'`) to persist across page refreshes within the tab.

`AdminGuard` checks both `AdminState.isAuthenticated` (NGXS in-memory) and
`authService.isAdminLoggedIn()` (sessionStorage) so that page refresh does not
log out the admin.

**To change admin credentials:** edit `environment.ts` and `environment.prod.ts`:
```typescript
adminCredentials: { username: 'admin', password: 'admin123' }
```

This is intentionally simple. For production, replace with Firebase Auth.

---

## 9. Routing Map

| URL | Component | Guard | Module |
|---|---|---|---|
| `/` | `PinEntry` | — | UserModule |
| `/register` | `Register` | — | UserModule |
| `/question` | `Question` | `SessionGuard` | UserModule |
| `/result` | `Result` | `SessionGuard` | UserModule |
| `/admin/login` | `Login` | — | AdminModule |
| `/admin` | `Dashboard` | `AdminGuard` | AdminModule |
| `/admin/quiz/:id` | `QuizManage` | `AdminGuard` | AdminModule |
| `/admin/monitor/:id` | `LiveMonitor` | `AdminGuard` | AdminModule |
| `/ranking/:quizId` | `Bracket` | — | RankingModule |

All modules are **lazy-loaded** via `loadChildren` in `app-routing-module.ts`.

---

## 10. User Flow (Step by Step)

```
PinEntry (/)
  → dispatch LoadQuizByPin(pin)
  → on activeQuiz set → navigate to /register

Register (/register)
  → dispatch LoadQuestions(quizId)
  → dispatch CreateSession(quizId, name, phone, questions.length)
  → navigate to /question

Question (/question)
  → display currentQuestion from QuizState
  → user taps option → dispatch SubmitAnswer(answer)
  → show correct/wrong feedback (options become disabled)
  → user taps Next → dispatch NextQuestion
  → if isLastQuestion → dispatch CompleteSession → navigate to /result

Result (/result)
  → display score and accuracy %
  → "View Leaderboard" → navigate to /ranking/:quizId
  → "Play Another" → navigate to /
```

**No-back-navigation is enforced** by disabling all option buttons after one
is selected (`[disabled]="answered"`) and never exposing a "Previous Question"
action in the NGXS store.

---

## 11. Admin Flow (Step by Step)

```
Login (/admin/login)
  → dispatch AdminLogin(username, password)
  → on isAuthenticated → navigate to /admin

Dashboard (/admin)
  → dispatch LoadAllQuizzes on init
  → Create Quiz → modal → dispatch CreateQuiz({ title, pin, status:'waiting' })
  → "Questions" → navigate to /admin/quiz/:id
  → "Monitor" → navigate to /admin/monitor/:id
  → "Ranking" → navigate to /ranking/:id
  → "Start" → dispatch SetQuizStatus(id, 'active')
  → "End" → dispatch SetQuizStatus(id, 'finished')
  → "Delete" → dispatch DeleteQuiz(id)

QuizManage (/admin/quiz/:id)
  → dispatch LoadAdminQuestions(quizId) on init
  → Add Question → modal with FormArray of 4 option inputs + correct answer selector
  → dispatch CreateQuestion(quizId, { text, options, correctOptionId, order })
  → Edit → dispatch UpdateQuestion(...)
  → Delete → dispatch DeleteQuestion(...)

LiveMonitor (/admin/monitor/:id)
  → dispatch LoadLiveParticipants(quizId) on init
  → polls every 5 seconds via RxJS interval (autoRefresh toggle)
  → shows participant cards with name/phone/score/status
  → summary stats via CompletedCountPipe and AvgScorePipe
```

---

## 12. Design System (`src/styles.scss`)

All styles are global SCSS. There are no component-level stylesheets (the
generated `.scss` files per component are empty).

**CSS Variables (defined on `:root`):**

| Variable | Value | Usage |
|---|---|---|
| `--bg` | `#0a0a0f` | Page background |
| `--surface` | `#13131a` | Cards and panels |
| `--surface2` | `#1c1c27` | Inputs, inner containers |
| `--border` | `rgba(255,255,255,0.07)` | All borders |
| `--primary` | `#7c6af7` | Purple — main accent |
| `--primary-glow` | `rgba(124,106,247,0.3)` | Shadows and fills |
| `--accent` | `#f7c26a` | Gold — secondary accent |
| `--success` | `#4ade80` | Correct answer, active status |
| `--danger` | `#f87171` | Wrong answer, delete actions |
| `--text` | `#f0f0f8` | Primary text |
| `--text-muted` | `#7a7a9a` | Labels, secondary text |
| `--radius` | `16px` | Card border radius |
| `--radius-sm` | `8px` | Input/button border radius |
| `--transition` | `0.3s cubic-bezier(0.4,0,0.2,1)` | All transitions |

**Typography:** `'Syne'` (headings, scores, labels — weights 700/800) and
`'DM Sans'` (body, inputs — weights 300/400/500), both from Google Fonts.

**Key shared CSS classes:**
- `.page-wrapper` — full-height flex center, used by all user-facing pages
- `.card` / `.card-wide` — the main card container
- `.btn`, `.btn-primary`, `.btn-accent`, `.btn-outline`, `.btn-danger`, `.btn-success`, `.btn-sm`
- `.form-group` — label + input wrapper with error message slot
- `.pin-input` — large centered bold input for PIN entry
- `.option-btn` — quiz answer button (states: default, `.selected`, `.correct`, `.wrong`)
- `.progress-bar` / `.progress-fill` — animated progress indicator
- `.badge` — status pills (`.badge-waiting`, `.badge-active`, `.badge-finished`)
- `.admin-layout`, `.admin-header`, `.admin-content` — admin page shell
- `.data-table` — styled HTML table
- `.modal-overlay` / `.modal` — overlay dialog pattern
- `.quiz-card` — quiz list item in admin dashboard
- `.bracket-container`, `.podium`, `.bracket-tree` — ranking page layout
- `.monitor-grid`, `.monitor-card` — live monitor participant grid
- `.loader` — centered spinner with message

**Animations (defined as `@keyframes`):**
`fadeIn`, `fadeInUp`, `slideUp`, `spin`, `pulse`, `popIn`, `gradientShift`

---

## 13. Shared Pipes (`src/app/shared/`)

Both pipes are declared in `SharedModule` which is imported by `AdminModule`.

| Pipe | Input | Output |
|---|---|---|
| `completedCount` | `UserSession[]` | `number` — count with `completedAt` set |
| `avgScore` | `UserSession[]` | `number` — average `(score/totalQuestions)*100`, rounded |

---

## 14. Known Decisions and Constraints

- **AngularFire (`@angular/fire`) is installed but not used.** It was installed
  during setup but the provider pattern conflicted with Angular 21. The plain
  `firebase` SDK is used instead via DI tokens. `@angular/fire` can be removed
  from `package.json` if desired.

- **No image upload support.** Questions are text-only. Firebase Storage is
  not configured.

- **Admin credentials are stored in `environment.ts`.** This is acceptable for
  a prototype. For production, replace with Firebase Auth.

- **Firestore security rules are in test mode.** Open read/write. Tighten before
  going to production (see `SETUP.md`).

- **Speed scoring is out of scope** for the current version. The data model
  does not record answer timestamps. To add speed scoring later, add a
  `answeredAt: Timestamp` field to `UserAnswer` and record it in `SubmitAnswer`.

- **`tsconfig.json` has `"strictTemplates": false`** to prevent template type
  errors from blocking development. Tighten this incrementally as the project matures.

---

## 15. Environment Configuration

**File:** `src/environments/environment.ts` (dev) and `environment.prod.ts` (prod)

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  },
  adminCredentials: {
    username: "admin",
    password: "admin123"
  }
};
```

The production swap is handled by `angular.json` `fileReplacements` configuration.

---

## 16. Running and Building

```bash
# Install dependencies
npm install

# Development server (http://localhost:4200)
ng serve

# Production build
ng build --configuration=production

# Deploy to Firebase Hosting
firebase deploy
```

Build output goes to `dist/quizapp/browser/`. The `firebase.json` is already
configured to serve this directory with SPA rewrites.

---

## 17. Future Features to Consider

The following were discussed during design but are not implemented:

- **Speed-based scoring** — record `answeredAt` on `UserAnswer`, compute
  time-bonus in `SubmitAnswer` action.
- **Real-time Firestore listeners** — replace `getDocs` with `onSnapshot` in
  `QuizService` for live monitor and bracket updates.