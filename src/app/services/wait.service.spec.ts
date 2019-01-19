import { TestBed } from '@angular/core/testing';

import { WaitService } from './wait.service';

describe('WaitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WaitService = TestBed.get(WaitService);
    expect(service).toBeTruthy();
  });
});
