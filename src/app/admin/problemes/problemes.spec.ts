import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problemes } from './problemes';

describe('Problemes', () => {
  let component: Problemes;
  let fixture: ComponentFixture<Problemes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Problemes],
    }).compileComponents();

    fixture = TestBed.createComponent(Problemes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
