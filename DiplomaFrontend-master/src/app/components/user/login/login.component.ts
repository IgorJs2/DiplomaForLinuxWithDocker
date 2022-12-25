import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {AuthRequest} from "../../../models/auth-request.model";
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    hide: boolean = true;
    form: FormGroup;

    errorMessage: string;

    constructor(
        private authService: AuthService, private router: Router) {
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            username: new FormControl('', [
                Validators.required]),
            password: new FormControl('', [
                Validators.required]),
        })
    }

    submit(): void {
        if (this.form.valid) {
            const username = this.form.get('username')?.value
            const password = this.form.get('password')?.value
            const authRequest = new AuthRequest();
            authRequest.username = username;
            authRequest.password = password;
            this.authService.login(authRequest).subscribe(response => {
                this.router.navigateByUrl('/');
            }, (error) => {
                this.form.reset()
                if (error.status == 401) {
                    this.errorMessage = 'Невірний логін або пароль'
                } else {
                    this.errorMessage = 'Проблеми на стороні сервера'
                }
            });
        }
    }
}
