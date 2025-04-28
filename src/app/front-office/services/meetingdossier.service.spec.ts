import { TestBed } from '@angular/core/testing';

import { MeetingdossierService } from './meetingdossier.service';

describe('MeetingdossierService', () => {
  let service: MeetingdossierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingdossierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
