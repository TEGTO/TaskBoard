import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DevModeService {

  isDevMode() {
    return isDevMode();
  }
}
