import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveMonitor } from './live-monitor';

describe('LiveMonitor', () => {
  let component: LiveMonitor;
  let fixture: ComponentFixture<LiveMonitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiveMonitor],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveMonitor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
