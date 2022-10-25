import { Injectable } from '@angular/core';

import { allBooks, allReaders } from 'app/data';
import { Reader } from "app/models/reader";
import { Book } from "app/models/book";
import { BookTrackerError } from 'app/models/bookTrackerError';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpContext } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { OldBook } from 'app/models/oldBook';
import { CONTENT_TYPE } from './add-header.interceptor';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient
  ) { }

  mostPopularBook: Book = allBooks[0];

  setMostPopularBook(popularBook: Book): void {
    this.mostPopularBook = popularBook;
  }

  getAllReaders(): Reader[] {
    return allReaders;
  }

  getReaderById(id: number): Reader {
    return allReaders.find(reader => reader.readerID === id);
  }

  getAllBooks(): Observable<Book[] | BookTrackerError> {
    return this.http.get<Book[]>('api/books', {
      context: new HttpContext().set(CONTENT_TYPE, 'application/xml')
    })
      .pipe(
        catchError(err => this.handleHttpError(err))
      );
  }

  getBookById(id: number): Observable<Book> {
    // let getHeaders: HttpHeaders = new HttpHeaders({  // more verbose way
    //   'Accept':'application/json',
    //   'Authorization':'my-token'
    // });

    return this.http.get<Book>(`/api/books/${id}`, {
      headers: new HttpHeaders({
        'Accept':'application/json',
        'Authorization':'my-token'
      })
    });
  }

  getOldBookById(id: number): Observable<OldBook> {
    return this.http.get<Book>(`/api/books/${id}`).pipe(
      map(b => <OldBook> {
        bookTitle: b.title,
        year: b.publicationYear
      })
    );
  }

  addBook(newBook: Book): Observable<Book> {
    return this.http.post<Book>('/api/books', newBook, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }


  // By convention nothing is returned in the Http of update request (case success)
  updateBook(updateBook: Book): Observable<void> {
    return this.http.put<void>(`/api/books/${updateBook.bookID}`, updateBook, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  deleteBook(bookID: number): Observable<void> {
    return this.http.delete<void>(`/api/books/${bookID}`);
  }

  private handleHttpError(err: HttpErrorResponse): Observable<BookTrackerError> {
    let dataError = new BookTrackerError();
    dataError.errorNumber = 100;
    dataError.message = err.statusText;
    dataError.friendlyMessage = 'An error occured retrieving data.';
    return throwError(dataError);
  }

}
