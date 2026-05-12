import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizManage } from './quiz-manage';

describe('QuizManage', () => {
  let component: QuizManage;
  let fixture: ComponentFixture<QuizManage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizManage],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizManage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
