import { TestBed } from '@angular/core/testing';

import { MedicalfolderService } from './medicalfolder.service';

describe('MedicalfolderService', () => {
  let service: MedicalfolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalfolderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
