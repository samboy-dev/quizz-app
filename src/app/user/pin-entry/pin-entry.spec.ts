import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinEntry } from './pin-entry';

describe('PinEntry', () => {
  let component: PinEntry;
  let fixture: ComponentFixture<PinEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PinEntry],
    }).compileComponents();

    fixture = TestBed.createComponent(PinEntry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
