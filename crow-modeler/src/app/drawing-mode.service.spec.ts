import { TestBed } from '@angular/core/testing';

import { DrawingModeService } from './drawing-mode.service';

describe('DrawingModeService', () => {
  let service: DrawingModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawingModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
