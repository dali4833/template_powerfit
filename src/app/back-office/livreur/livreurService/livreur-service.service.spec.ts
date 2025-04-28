import { TestBed } from '@angular/core/testing';

import { LivreurServiceService } from './livreur-service.service';

describe('LivreurServiceService', () => {
  let service: LivreurServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivreurServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
