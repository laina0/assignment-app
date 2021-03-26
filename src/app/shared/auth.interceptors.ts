import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Code reprise à partir d'une formation Angular passé au travaill
 * https://www.alexandria-library.co/courses/maitriser-angular-developper-votre-premiere-application-professionnelle/lessons/chapitre-8-maitriser-lauthentification/topic/1-lauthentification-avec-jwt/
 */

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (localStorage.getItem('token')) {
            request = this.addToken(request, localStorage.getItem('token'));
        }

        request = this.addContentType(request);
        return next.handle(request).pipe();
    }

    // Ajouter content type
    private addContentType(request: HttpRequest<any>): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Ajout du token d'authorisation sur l'en-tête des requêtes
    private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    private isPublicRequest(url: string): boolean {
        return (url.includes('authenticate'));
    }
}
