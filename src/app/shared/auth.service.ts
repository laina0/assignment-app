import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../authentication/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn = false;
  admin = false;

  // j'ai pris le code pour l'authentification dans une formation angular que j'ai suivi
  private user: BehaviorSubject<User | null> = new BehaviorSubject(null);
  public readonly user$: Observable<User | null> = this.user.asObservable();

  constructor(private http: HttpClient) {}

  // j'ai pris le code pour l'authentification dans une formation angular que j'ai suivi
  // dans mon travail actuel
  //  https://www.alexandria-library.co/courses/maitriser-angular-developper-votre-premiere-application-professionnelle/lessons/chapitre-8-maitriser-lauthentification/topic/1-lauthentification-avec-jwt/
  public logIn(addrEmail: string, motdepasse: string): Observable<User | null> {
    // typiquement, acceptera en paramètres un login et un password
    // vérifier qu'ils sont ok, et si oui, positionner la propriété loggedIn à true
    // si login/password non valides, positionner à false;
    const url = `${environment.url}/authenticate`;
    const data = {
      email: addrEmail,
      password: motdepasse
    };

    return this.http.post<User>(url, data, {}).pipe(
      switchMap((res: any) => {
        this.loggedIn = true;
        this.admin = true;
        this.saveAuthData(res.token, res.data.username);
        return of(this.getUser(res));
      }),
      tap(user => this.user.next(user))
    );
  }

  public singIn(username: string, email: string, password: string) {
    const url = `${environment.url}/account`;
    const data = {
      username: username,
      email: email,
      password: password
    };

    return this.http.post<User>(url, data, {});
  }

  logOut() {
    this.loggedIn = false;
    this.admin = false;
  }

  // exemple d'utilisation :
  // isAdmin.then(admin => { console.log("administrateur : " + admin);})
  isAdmin() {
    return new Promise((resolve, _reject) => {
      resolve(this.admin);
    });
  }

  isLoggedIn() {
    return new Promise((resolve, _reject) => {
      resolve(localStorage.getItem('token'));
    });
  }

  private getUser(data: any) {
      return new User({
          id: data.data._id,
          username: data.data.username,
          token: data.token
      });
  }

  private saveAuthData(token: string, username?: string) {
      const now = new Date();
      const expirationDate = (now.getTime() + 3600 * 1000).toString();
      localStorage.setItem('expirationDate', expirationDate);
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
  }
}

