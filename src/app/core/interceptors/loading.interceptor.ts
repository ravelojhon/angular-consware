import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { LoadingService } from './loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private readonly loadingService = inject(LoadingService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Mostrar loading para todas las requests excepto las de test
    if (!req.url.includes('test-api')) {
      this.loadingService.show();
    }

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          // Log de requests exitosas
          console.log(`✅ HTTP ${req.method} ${req.url} - Status: ${event.status}`);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Log de errores
        console.error(`❌ HTTP ${req.method} ${req.url} - Error: ${error.status} ${error.message}`);
        return throwError(() => error);
      }),
      finalize(() => {
        // Ocultar loading al finalizar (éxito o error)
        if (!req.url.includes('test-api')) {
          // Usar setTimeout para evitar ExpressionChangedAfterItHasBeenCheckedError
          setTimeout(() => {
            this.loadingService.hide();
          }, 0);
        }
      })
    );
  }
}
