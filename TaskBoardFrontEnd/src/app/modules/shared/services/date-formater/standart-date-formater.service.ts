import { DatePipe } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { DateConfig } from '../../configs/date-config/date-config';
import { DATE_CONFIG } from '../../configs/date-config/date-config.service';
import { DateFormaterService } from "./date-formater.service";

@Injectable({
    providedIn: 'root'
})
export class StandartDateFormaterService implements DateFormaterService {
    pipe = new DatePipe('en-US');

    constructor(@Inject(DATE_CONFIG) private dateConfig: DateConfig) { }

    formatDate(date: Date | undefined) {
        if (!date) return Date.now();
        return this.pipe.transform(date, this.dateConfig.format)!;
    }
}