import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cours } from '../assignments/cours.model';

@Injectable({
  providedIn: 'root'
})
export class CoursService {
  cours: Cours[] = [];

  constructor(private http: HttpClient) { }

  getCours(): Observable<any> {
    const url = `${environment.url}/cours`;

    return this.http.get<Cours[]>(url);
  }
}
