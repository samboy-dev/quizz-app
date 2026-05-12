# QuizBlitz — Setup Guide

## 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project
2. Enable **Firestore Database** (Start in test mode for development)
3. Go to **Project Settings → General → Your apps** and add a Web app
4. Copy your Firebase config object

## 2. Configure the App

Open `src/environments/environment.ts` and replace with your Firebase config:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
  },
  adminCredentials: {
    username: "admin",         // Change this!
    password: "admin123"       // Change this!
  }
};
```

Do the same for `src/environments/environment.prod.ts`.

## 3. Firestore Security Rules

In Firebase Console → Firestore → Rules, use these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /quizzes/{quizId} {
      allow read: if true;
      allow write: if true; // Tighten this in production
      match /questions/{questionId} {
        allow read, write: if true;
      }
    }
    match /sessions/{sessionId} {
      allow read, write: if true;
      match /answers/{answerId} {
        allow read, write: if true;
      }
    }
  }
}
```

## 4. Install & Run

```bash
npm install
ng serve
```

App runs at http://localhost:4200

## 5. Firebase Hosting Deployment

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select: dist/quizapp/browser as public directory
# Configure as SPA: Yes
# Overwrite index.html: No
ng build --configuration=production
firebase deploy
```

## 6. App Flow

### For Users
1. Open the app → Enter PIN given by admin
2. Enter your name and phone number
3. Answer all questions (no going back!)
4. See your score and view the ranking

### For Admin
1. Go to `/admin/login`
2. Default credentials: `admin` / `admin123`
3. Create a quiz with a title and PIN
4. Add questions with 4 options each, mark the correct answer
5. Click **Start** to make the quiz active
6. Share the PIN with participants
7. Monitor live progress at Monitor view
8. Click **Ranking** to see the bracket leaderboard

## 7. Data Model

```
Firestore Structure:
├── quizzes/
│   └── {quizId}/
│       ├── title: string
│       ├── pin: string
│       ├── status: "waiting" | "active" | "finished"
│       ├── createdAt: timestamp
│       └── questions/
│           └── {questionId}/
│               ├── text: string
│               ├── order: number
│               ├── options: [{id, text}]
│               └── correctOptionId: string
└── sessions/
    └── {sessionId}/
        ├── quizId: string
        ├── name: string
        ├── phone: string
        ├── score: number
        ├── totalQuestions: number
        ├── joinedAt: timestamp
        ├── completedAt: timestamp
        └── answers/
            └── {answerId}/
                ├── questionId: string
                ├── selectedOptionId: string
                └── isCorrect: boolean
```

## 8. NGXS State Architecture

| State | Responsibility |
|---|---|
| `QuizState` | Active quiz, questions list, current question index, progress |
| `SessionState` | Current user session, submitted answers, score |
| `AdminState` | Auth, quiz CRUD, questions CRUD, live participants |
| `RankingState` | Sorted participants, bracket data |

## 9. Project Structure

```
src/app/
├── user/          # PIN entry → Register → Question → Result
├── admin/         # Login → Dashboard → Quiz Manage → Live Monitor
├── ranking/       # Bracket leaderboard
├── core/
│   ├── models/    # TypeScript interfaces
│   ├── services/  # QuizService, AuthService
│   ├── guards/    # AdminGuard, SessionGuard
│   └── tokens.ts  # DI tokens for Firebase
├── shared/
│   └── pipes/     # CompletedCountPipe, AvgScorePipe
└── store/         # All NGXS states and actions
```
