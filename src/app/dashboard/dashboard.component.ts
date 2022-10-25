import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';

import { Book } from "app/models/book";
import { Reader } from "app/models/reader";
import { DataService } from 'app/core/data.service';
import { BookTrackerError } from 'app/models/bookTrackerError';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  allBooks: Book[];
  allReaders: Reader[];
  mostPopularBook: Book;

  constructor(
    private dataService: DataService,
    private title: Title,
    private route: ActivatedRoute
              ) { }

  ngOnInit() {
    /* Handeled by the router (through a resolver) */
    // this.dataService.getAllBooks().subscribe(
    //   (books: Book[] | BookTrackerError) => this.allBooks = <Book[]>books,
    //   (err: BookTrackerError) => console.error(err.friendlyMessage),
    //   () => console.log('Getting books complete')
    // );

    let resolvedData: Book[] | BookTrackerError = this.route.snapshot.data['resolvedBooks'];
    if (resolvedData instanceof BookTrackerError) {
      console.log(`Dashboard component error: ${resolvedData.friendlyMessage}`);
    } else {
      this.allBooks = resolvedData;
    }

    this.allReaders = this.dataService.getAllReaders();
    this.mostPopularBook = this.dataService.mostPopularBook;

    this.title.setTitle(`Book Tracker`);
  }

  deleteBook(bookID: number): void {
    const index = this.allBooks.findIndex(book => book.bookID === bookID);
    this.dataService.deleteBook(bookID)
      .subscribe(
        (data: void) => {
          console.log(`Producct with the id: ${bookID} was deleted.`);
          this.allBooks.splice(index, 1);
        },
        (err: any) => console.error(err)
      )
  }

  deleteReader(readerID: number): void {
    console.warn(`Delete reader not yet implemented (readerID: ${readerID}).`);
  }

}
