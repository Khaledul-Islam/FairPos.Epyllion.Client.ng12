import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../auth/authentication.service';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { EnvService } from '@env/environment';
import { CredentialsService } from '@app/auth';
import { UsersWeb } from '@app/models/UsersWeb';
import { catchError, retry, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

declare var $: any;

/**
 * Prefixes all requests not starting with `http[s]` with `environment.serverUrl`.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiPrefixInterceptor implements HttpInterceptor {
  static loaderCounter: number = 0;

  constructor(
    private env: EnvService,
    private credentialsService: CredentialsService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let currentUser = this.credentialsService.credentials as UsersWeb;
    //console.log(currentUser);

    if (request.reportProgress == false) {
      if (currentUser && currentUser.accessToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        });
      }
    }

    if (!/^(http|https):/i.test(request.url)) {
      request = request.clone({ url: this.env.apiUrl + request.url });
    }
    //return next.handle(request);

    if (ApiPrefixInterceptor.loaderCounter == 0) {
      $('.preloader').fadeIn();
    }

    return next.handle(request).pipe(
      tap((evt) => {
        if (evt instanceof HttpResponse) {
          if (evt.body && evt.body.success) console.log('handle map');
          setTimeout(this.unloadBlockUI, 700);
        }
      }),

      catchError((err: HttpErrorResponse) => {
        {
          if (err.status === 403) {
            //alert("403 Forbidden!");
            this.router.navigate(['/forbidden']);
          }

          if (this.router.url !== '/pages/auth/login' && err.status === 401) {
            const refreshToken$ = this.authenticationService.refreshToken(currentUser);
            refreshToken$.subscribe(
              (credentials) => {
                if (credentials) {
                  debugger;
                  // log.debug(`${credentials.username} successfully logged in`);
                  this.router.navigate([this.router.url]);
                  // location.reload();
                }
              },
              (error) => {
                debugger;
                this.router.navigate(['/login']);
                console.log('Token Refresh Failed');
              }
            );

            // this.credentialsService.setCredentials();
            // this.router.navigate(['/login']);
            // console.log('401 Unauthorized!');
          }

          if (this.router.url !== '/login' && err.status === 429) {
            this.credentialsService.setCredentials();
            this.router.navigate(['/invalidsession']);
            console.log('429 invalid session!');
          }

          if (this.router.url !== '/login' && err.status === 430) {
            this.credentialsService.setCredentials();
            this.router.navigate(['/under-maintenance']);
            console.log('430 Under Maintenance');
          }

          console.log('handle error');
          setTimeout(this.unloadBlockUI, 700);

          let message = '';
          if (err.error instanceof ErrorEvent) {
            // handle client-side error
            message = `Error: ${err.error.message}`;
          } else {
            // handle server-side error
            message = `Error Status: ${err.status}\nMessage: ${err.message}`;
          }
          console.log(message);
          return throwError(err);
        }
      })
    );
  }

  unloadBlockUI() {
    if (ApiPrefixInterceptor.loaderCounter > 0)
      ApiPrefixInterceptor.loaderCounter = ApiPrefixInterceptor.loaderCounter - 1;
    //console.log(JwtInterceptor.loaderCounter);
    if (ApiPrefixInterceptor.loaderCounter == 0) {
      $('.preloader').fadeOut();
    }
  }
}
