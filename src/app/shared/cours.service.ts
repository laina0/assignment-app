import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cours } from '../assignments/cours.model';
import { LoggingService } from './logging.service';
import {catchError, switchMap, tap, toArray} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoursService {
  
  cours: Cours[] = [];

  constructor(private loggingService: LoggingService, private http: HttpClient) { }

  getCours(): Observable<Cours[]> {
    const url = `${environment.url}/cours`;

    return this.http.get<Cours[]>(url);
  }

}
