import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContextToken
} from '@angular/common/http';
import { Observable } from 'rxjs';

export const CONTENT_TYPE = new HttpContextToken(() => 'application/json')

@Injectable()
export class AddHeaderInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    console.log(`AddHeaderInterceptor  - ${request.url}`); // HttpRequest passed to the interceptor
    let jsonReq: HttpRequest<unknown> = request.clone({
      setHeaders: { 'Content-Type': request.context.get(CONTENT_TYPE) }  // cloning the HttpRequest and adding setting Headers
    });

    return next.handle(jsonReq); // Passe the new HttpRequest altered by the interceptor
  }
}
