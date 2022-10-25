import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';

import { Book } from "app/models/book";
import { Reader } from "app/models/reader";
import { DataService } from 'app/core/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  allBooks: Book[];
  allReaders: Reader[];
  mostPopularBook: Book;

  constructor(private dataService: DataService,
              private title: Title) { }

  ngOnInit() {
    this.dataService.getAllBooks().subscribe(
      (books: Book[]) => this.allBooks = books,
      (err) => console.error(err),
      () => console.log('Getting books complete')
    );
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
