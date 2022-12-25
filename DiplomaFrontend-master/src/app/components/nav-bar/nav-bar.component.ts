import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user.model";

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

    user: User | null = null;

    constructor(private authService: AuthService) {
    }

    ngOnInit(): void {
        this.updateUser();
        this.authService.currentUserEmitter.subscribe(() => this.updateUser());
    }

    private updateUser() {
        this.authService.getCurrentUser$().subscribe(user => this.user = user.id ? user : null);
    }

    logOut(): void {
        this.authService.logOut();
    }

}
