import { TestBed } from '@angular/core/testing';

import { SqlService } from './sql.service';

describe('SqlService', () => {
  let service: SqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
