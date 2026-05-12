import { InjectionToken } from '@angular/core';
import { Firestore } from 'firebase/firestore';

export const FIREBASE_APP_TOKEN = new InjectionToken<any>('FIREBASE_APP');
export const FIRESTORE_TOKEN = new InjectionToken<Firestore>('FIRESTORE');
