import { Injectable, Inject } from '@angular/core';
import {
  Firestore, collection, query, where, getDocs, addDoc,
  doc, updateDoc, deleteDoc, orderBy
} from 'firebase/firestore';
import { FIRESTORE_TOKEN } from '../tokens';
import { Quiz, Question, UserSession, UserAnswer } from '../models';

@Injectable({ providedIn: 'root' })
export class QuizService {
  constructor(@Inject(FIRESTORE_TOKEN) private firestore: Firestore) {}

  async getQuizByPin(pin: string): Promise<Quiz | null> {
    const q = query(collection(this.firestore, 'quizzes'), where('pin', '==', pin));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as Quiz;
  }

  async getAllQuizzes(): Promise<Quiz[]> {
    const snap = await getDocs(collection(this.firestore, 'quizzes'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Quiz));
  }

  async createQuiz(quiz: Partial<Quiz>): Promise<string> {
    const ref = await addDoc(collection(this.firestore, 'quizzes'), {
      ...quiz, createdAt: new Date(), status: quiz.status || 'waiting'
    });
    return ref.id;
  }

  async updateQuiz(id: string, data: Partial<Quiz>): Promise<void> {
    await updateDoc(doc(this.firestore, 'quizzes', id), data as any);
  }

  async deleteQuiz(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'quizzes', id));
  }

  async getQuestions(quizId: string): Promise<Question[]> {
    const q = query(collection(this.firestore, 'quizzes', quizId, 'questions'), orderBy('order'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Question));
  }

  async createQuestion(quizId: string, question: Partial<Question>): Promise<string> {
    const ref = await addDoc(collection(this.firestore, 'quizzes', quizId, 'questions'), question);
    return ref.id;
  }

  async updateQuestion(quizId: string, questionId: string, data: Partial<Question>): Promise<void> {
    await updateDoc(doc(this.firestore, 'quizzes', quizId, 'questions', questionId), data as any);
  }

  async deleteQuestion(quizId: string, questionId: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'quizzes', quizId, 'questions', questionId));
  }

  async createSession(session: UserSession): Promise<string> {
    const ref = await addDoc(collection(this.firestore, 'sessions'), session);
    return ref.id;
  }

  async submitAnswer(sessionId: string, answer: UserAnswer): Promise<void> {
    await addDoc(collection(this.firestore, 'sessions', sessionId, 'answers'), answer);
  }

  async completeSession(sessionId: string, score: number): Promise<void> {
    await updateDoc(doc(this.firestore, 'sessions', sessionId), { score, completedAt: new Date() });
  }

  async getParticipants(quizId: string): Promise<UserSession[]> {
    const q = query(collection(this.firestore, 'sessions'), where('quizId', '==', quizId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as UserSession));
  }
}
