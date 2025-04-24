import { TestBed } from '@angular/core/testing';

import { BacknutriService } from './backnutri.service';

describe('BacknutriService', () => {
  let service: BacknutriService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BacknutriService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
