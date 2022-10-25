import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Book } from "app/models/book";
import { BookTrackerError } from "app/models/bookTrackerError";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { DataService } from "./data.service";


@Injectable({
  providedIn: 'root'
})
export class BooksResolverService implements Resolve<Book[] | BookTrackerError> {
  constructor(private dataService: DataService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<Book[] | BookTrackerError>  {
    return this.dataService.getAllBooks()
      .pipe(
        // another option is to inject the router and navigate the user into another error page
        catchError(err => of(err))
      );
  }
}
