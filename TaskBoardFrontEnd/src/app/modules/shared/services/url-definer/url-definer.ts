import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class URLDefiner {
  abstract combineWithApiUrl(subpath: string): string;
}
