import { TestBed } from '@angular/core/testing';

import { RolesCheckService } from './roles-check.service';

describe('RolesCheckService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RolesCheckService = TestBed.get(RolesCheckService);
    expect(service).toBeTruthy();
  });
});
