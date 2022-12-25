import {HttpClient} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {CookieService} from "ngx-cookie-service";
import {User} from "../models/user.model";
import {AuthRequest} from "../models/auth-request.model";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public currentUserSubject: BehaviorSubject<User>;
    public currentUser$: Observable<User>;
    public currentUserEmitter = new EventEmitter<boolean>();

    baseUrl = environment.baseUrl;

    constructor(private http: HttpClient,
                private dialogRef: MatDialog,
                private cookieService: CookieService,
                private router: Router) {
    }

    public getCurrentUser$(): Observable<User> {
        return this.http.get<User>(this.baseUrl + '/current_user/').pipe()
    }

    public getCurrentUser(): User | null {
        const user = this.cookieService.get('user');
        if (user) {
            return JSON.parse(user) as User;
        }
        return null;
    }

    public login(token: AuthRequest) {
        return this.http.post(this.baseUrl + '/token/', token)
            .pipe(
                map(response => {
                    this.setCookie(response);
                    this.getCurrentUser$().subscribe(user => {
                        this.cookieService.set('user', JSON.stringify(user));
                        this.currentUserEmitter.emit(true);
                    })
                    return response;
                }));
    }

    public logOut(): void {
        sessionStorage.clear();
        this.cookieService.deleteAll();
        this.currentUserEmitter.emit(false);
        this.router.navigateByUrl('/');
    }

    private setCookie(response: any): void {
        this.cookieService.set('access', response.access);
        this.cookieService.set('refresh', response.refresh);
    }
}
