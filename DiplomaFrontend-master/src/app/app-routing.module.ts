import {Injectable, NgModule} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, Routes} from '@angular/router';
import {LoginComponent} from "./components/user/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {CookieService} from "ngx-cookie-service";
import {Location} from '@angular/common'

@Injectable({
    providedIn: 'root'
})

class Permissions {
    constructor(private router: Router, private location: Location) {
    }

    canActivate(cookie: CookieService): boolean {
        if (!cookie.get('user')) {
            return true
        } else {
            this.router.navigateByUrl('/');
            return false;
        }
    }
}

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private cookie: CookieService, private permissions: Permissions) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        return this.permissions.canActivate(this.cookie);
    }
}

@Injectable({
    providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        window.location.href = route.data['externalUrl'];
        return true;

    }
}

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent, canActivate: [AuthGuard]},
    {
        path: 'admin',
        canActivate: [RedirectGuard],
        component: RedirectGuard,
        data: {externalUrl: 'http://localhost:8000/admin'}
    },
    {path: '**', redirectTo: '/'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard, RedirectGuard, Permissions]
})
export class AppRoutingModule {
}
