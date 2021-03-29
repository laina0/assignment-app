import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// LoaderService pris sur l'url suivant:
// https://imdurgeshpal.medium.com/show-loader-spinner-on-http-request-in-angular-using-interceptor-68f57a9557a4

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  httpProgressing(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  // tslint:disable-next-line: typedef
  setHttpProgressingStatus(progress: boolean) {
    this.isLoading$.next(progress);
  }
}
