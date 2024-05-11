import { TestBed } from '@angular/core/testing';

import { PriorityConvertorService } from './priority-convertor.service';

describe('PriorityConvertorService', () => {
  let service: PriorityConvertorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriorityConvertorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
