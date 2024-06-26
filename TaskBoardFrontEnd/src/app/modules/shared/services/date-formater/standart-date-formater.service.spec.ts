import { TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { DateConfig } from '../../configs/date-config/date-config';
import { DATE_CONFIG } from '../../configs/date-config/date-config.service';
import { StandartDateFormaterService } from './standart-date-formater.service';

describe('StandartDateFormaterService', () => {
  const mockDateConfig: DateConfig = { format: 'MM/dd/yyyy' };
  var service: StandartDateFormaterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StandartDateFormaterService,
        { provide: DATE_CONFIG, useValue: mockDateConfig }
      ]
    });
    service = TestBed.inject(StandartDateFormaterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should format date correctly', () => {
    const testDate = new Date(2024, 4, 13); // May 13, 2024
    const formattedDate = service.formatDate(testDate);
    const pipe = new DatePipe('en-US');
    const expectedFormattedDate = pipe.transform(testDate, mockDateConfig.format);
    expect(formattedDate).toBe(expectedFormattedDate!);
  });
  it('should return current date if input is undefined', () => {
    const formattedDate = service.formatDate(undefined);
    expect(formattedDate).toBe(Date.now());
  });
});
