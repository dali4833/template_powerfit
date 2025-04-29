import { TestBed } from '@angular/core/testing';

import { DietProgramService } from './diet-program.service';

describe('DietProgramService', () => {
  let service: DietProgramService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DietProgramService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
