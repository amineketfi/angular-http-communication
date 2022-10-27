import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AddBookComponent } from './add-book/add-book.component';
import { AddReaderComponent } from './add-reader/add-reader.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditBookComponent } from './edit-book/edit-book.component';
import { EditReaderComponent } from './edit-reader/edit-reader.component';
import { BookTrackerErrorHandlerService } from './core/book-tracker-error-handler.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddHeaderInterceptor } from './core/add-header.interceptor';
import { LogResponseInterceptor } from './core/log-response.interceptor';
import { CacheInterceptor } from './core/cache.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AddBookComponent,
    EditReaderComponent,
    EditBookComponent,
    AddReaderComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: BookTrackerErrorHandlerService },
    /* Interceptors Order Matter!, the request is immutible! use clone method for any change*/
    { provide: HTTP_INTERCEPTORS, useClass: AddHeaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LogResponseInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
