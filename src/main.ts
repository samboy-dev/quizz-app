import { bootstrapApplication } from '@angular/platform-browser';
import { FIREBASE_APP_TOKEN, FIRESTORE_TOKEN } from './app/core/tokens';
import { initializeApp } from 'firebase/app';
import { environment } from './environments/environment';
import { getFirestore } from 'firebase/firestore';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { provideStore } from '@ngxs/store';
import { QuizState } from './app/store/quiz.state';
import { SessionState } from './app/store/session.state';
import { AdminState } from './app/store/admin.state';
import { RankingState } from './app/store/ranking.state';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { App } from './app/app';

import { provideZoneChangeDetection } from '@angular/core';

const app = initializeApp(environment.firebase);

bootstrapApplication(App, {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(appRoutes),
        provideStore(
            [QuizState, SessionState, AdminState, RankingState],
            withNgxsLoggerPlugin({ disabled: environment.production })
        ),
        { provide: FIREBASE_APP_TOKEN, useValue: app },
        { provide: FIRESTORE_TOKEN, useValue: getFirestore(app) },
        provideAnimations()
    ]
}).catch(err => console.error(err));
