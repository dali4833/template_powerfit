import { TestBed } from '@angular/core/testing';

import { WeeklyanalysisService } from './weeklyanalysis.service';

describe('WeeklyanalysisService', () => {
  let service: WeeklyanalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeeklyanalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
