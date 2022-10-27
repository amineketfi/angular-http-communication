import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest
} from '@angular/common/http/testing';
import { DataService } from './data.service';
import { Book } from 'app/models/book';
import { BookTrackerError } from 'app/models/bookTrackerError';

describe('DataService Tests', () => {

  let dataService: DataService;
  let httpTestingController: HttpTestingController;

  let testBooks: Book[] = [
    { bookID: 1, title: 'Goodnight Moon', author: 'Margaret Wise Brown', publicationYear: 1934 },
    { bookID: 2, title: 'Winnih-the-Pooh', author: 'A. A. Miline', publicationYear: 1926 },
    { bookID: 3, title: 'The Hobbit', author: 'J. R. R. Tolkien', publicationYear: 1937 }
  ];

  beforeEach(() => {

    // Configure the testing module
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ DataService ]
    });

    // initialization that needs to run berfore each test
    dataService = TestBed.inject(DataService);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should GET all books', () => {
    dataService.getAllBooks()
      .subscribe((data: Book[] | BookTrackerError) => {
        if (data instanceof Array)
          expect(data.length).toBe(3);
      });
    // A Mock Http Request
    let booksRequest: TestRequest = httpTestingController.expectOne('api/books');
    expect(booksRequest.request.method).toEqual('GET');

    booksRequest.flush(testBooks);

  });

  it('should return a BookTrackerError', () => {

    dataService.getAllBooks()
      .subscribe(
        (data: Book[] | BookTrackerError) => fail('this should have been an error'),
        (err: BookTrackerError) => {
          expect(err.errorNumber).toEqual(100);
          expect(err.friendlyMessage).toEqual('An error occured retrieving data.')
        }
      );

    // A Mock Http Request
    let booksRequest: TestRequest = httpTestingController.expectOne('api/books');

    booksRequest.flush('error', {
      status: 500,
      statusText: 'Server Error'
    });

  });

});
