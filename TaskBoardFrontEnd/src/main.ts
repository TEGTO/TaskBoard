import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule } from './app/modules/core/core.module';

enableProdMode();
platformBrowserDynamic().bootstrapModule(CoreModule)
  .catch(err => console.error(err));
