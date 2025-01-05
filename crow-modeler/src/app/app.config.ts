import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { authInterceptor } from './interceptor/auth-interceptor.interceptor';

export const appConfig: ApplicationConfig = {

  providers: [provideRouter(routes), provideToastr({
    timeOut: 100000, // 10 seconds
    closeButton: true,
    progressBar: false,
  }),
    provideAnimationsAsync(), provideAnimationsAsync(), 
    provideHttpClient(withInterceptors([authInterceptor]))]

};
