// Suppress PrimeUI license check notice
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('[PrimeUI]')) {
    return;
  }
  originalWarn.apply(console, args);
};

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app.component';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
