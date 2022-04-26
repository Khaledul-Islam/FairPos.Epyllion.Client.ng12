/*
 * Entry point of the application.
 * Only platform bootstrapping code should be here.
 * For app-specific initialization, use `app/app.component.ts`.
 */

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from '@app/app.module';
import { environment } from '@env/environment';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

if (environment.production) {
  enableProdMode();
}

const providers = [{ provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }];

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
