// import { ApplicationConfig } from '@angular/core';
// import { provideRouter } from '@angular/router';

// import { routes } from './app.routes';
// import { provideClientHydration } from '@angular/platform-browser';

// export const appConfig: ApplicationConfig = {
//   providers: [provideRouter(routes), provideClientHydration()]
// };
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Asegúrate de importar esto
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';
import { CommonModule } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()), // Añade esto para proporcionar HttpClient
    provideClientHydration(),
    CommonModule
  ]
};
