import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Assignment } from '../assignments/assignment.model';
import { LoggingService } from './logging.service';
import {catchError, switchMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {

  assignments: Assignment[] = [];
  // tslint:disable-next-line: variable-name

  constructor(private loggingService: LoggingService, private http: HttpClient) { }

  getAssignments(): Observable<Assignment[]> {
    const url = `${environment.url}/assignments`;

    return this.http.get<Assignment[]>(url);
  }

  getAssignmentsPagine(page: number, limit: number): Observable<any> {
    const url = `${environment.url}/assignments` + '?page=' + page + '&limit=' + limit;

    return this.http.get<Assignment[]>(url);
  }

  getAssignment(id: number): Observable<Assignment> {
    const url = `${environment.url}/assignments/` + id;

    return this.http.get<Assignment>(url);
  }

  generateId(): number {
    return Math.round(Math.random() * 100000);
  }

  addAssignment(assignment: Assignment): Observable<string> {

    const url = `${environment.url}/assignments`;
    const data = {
      id: this.generateId(),
      nom: assignment.nom,
      dateDeRendu: assignment.dateDeRendu,
      rendu: assignment.rendu,
    };

    return this.http.post<string>(url, data, {}).pipe(
      // tslint:disable-next-line: no-shadowed-variable
      switchMap(() => {
        return of('Success add data');
      }),
      tap( _ => { console.log('debug'); }),
      catchError(error => of(error))
    );
  }

  updateAssignment(assignment: Assignment): Observable<string> {
    // besoin de ne rien faire puisque l'assignment passé en paramètre
    // est déjà un élément du tableau

    // let index = this.assignments.indexOf(assignment);
    const url = `${environment.url}/assignments`;
    const data = {
      _id: assignment._id,
      nom: assignment.nom,
      dateDeRendu: assignment.dateDeRendu,
      rendu: assignment.rendu,
    };

    return this.http.put<string>(url, data, {}).pipe(
      // tslint:disable-next-line: no-shadowed-variable
      switchMap((data: any) => {
        return of(data);
      })
    );
  }

  deleteAssignment(id: number): Observable<string> {
    const url = `${environment.url}/assignments/` + id;

    return this.http.delete(url).pipe(
      switchMap((data: any) => {
        return this.http.post<string>(url, data, {}).pipe(
          // tslint:disable-next-line: no-shadowed-variable
          switchMap(() => {
            return of('Success add data');
          })
        );
      })
    );
  }

  // Méthode utiliser pour le drag and drop

  // tslint:disable-next-line: typedef
  populate(): Observable<any> {
    
    const url = `${environment.url}/assignments`;
    const results = [];
    // tslint:disable-next-line: deprecation
    this.getJSON().subscribe(data => {
      data.forEach(element => {
        results.push(this.http.post(url, element, {}).subscribe());
      });
    });

    return forkJoin(results);
  }

  getJSON(): Observable<any> {
    return this.http.get('assets/MOCK_DATA.json');
  }
}
