import { TestBed } from '@angular/core/testing';
import { Salle, SalleService } from './salle';

describe('Salle', () => {
  let service: SalleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
