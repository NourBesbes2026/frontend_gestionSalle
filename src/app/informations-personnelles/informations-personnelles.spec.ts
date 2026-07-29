import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationsPersonnelles } from './informations-personnelles';

describe('InformationsPersonnelles', () => {
  let component: InformationsPersonnelles;
  let fixture: ComponentFixture<InformationsPersonnelles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationsPersonnelles],
    }).compileComponents();

    fixture = TestBed.createComponent(InformationsPersonnelles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
