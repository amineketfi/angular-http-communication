import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpContextToken
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HttpCacheService } from './http-cache.service';
import { tap } from 'rxjs/operators';

export const CACHABEALE = new HttpContextToken(()=> true);

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(
    private cacheeService: HttpCacheService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // only cache requests configured to be cacheable
    if (!request.context.get(CACHABEALE)) {
      return next.handle(request);
    }

    // pass along non-cacheable requests and invalidate the cache
    if (request.method !== 'GET') {
      console.log(`Invalidating cache: ${request.method} ${request.url}`);
      this.cacheeService.invalidateCache();
      return next.handle(request);
    }

    //attempt to retrieve a cached response
    const cachedResponse: HttpResponse<any> = this.cacheeService.get(request.url);

    // return cached response
    if (cachedResponse) {
      console.log(`Returning a cached response: ${cachedResponse.url}`);
      console.log(cachedResponse);
      return of(cachedResponse);
    }

    // send request to server and add response to cache
    return next.handle(request)
      .pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            console.log(`Adding item to cache: ${request.url}`);
            this.cacheeService.put(request.url, event);
          }
        })
      );
  }
}
