import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { environment } from '../environments/environment';
import { QuizState } from './store/quiz.state';
import { SessionState } from './store/session.state';
import { AdminState } from './store/admin.state';
import { RankingState } from './store/ranking.state';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { FIREBASE_APP_TOKEN, FIRESTORE_TOKEN } from './core/tokens';

const app = initializeApp(environment.firebase);

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxsModule.forRoot([QuizState, SessionState, AdminState, RankingState], {
      developmentMode: !environment.production
    }),
    NgxsLoggerPluginModule.forRoot({ disabled: environment.production }),
  ],
  providers: [
    { provide: FIREBASE_APP_TOKEN, useValue: app },
    { provide: FIRESTORE_TOKEN, useValue: getFirestore(app) },
  ],
  bootstrap: [App]
})
export class AppModule {}
