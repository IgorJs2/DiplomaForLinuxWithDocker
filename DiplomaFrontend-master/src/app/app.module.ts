import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {AddCategoryComponent} from './components/add-category/add-category.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {RetrieveCategoryComponent} from './components/retrieve-category/retrieve-category.component';
import {MatButtonModule} from "@angular/material/button";
import {LoginComponent} from './components/user/login/login.component';
import {MapComponent} from './components/map/map.component';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {CookieService} from "ngx-cookie-service";
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import {ConfirmationComponent} from './components/retrieve-category/confirmation/confirmation.component';
import {AppRoutingModule} from "./app-routing.module";
import {HomeComponent} from './components/home/home.component';
import {MatCardModule} from "@angular/material/card";
import {FooterComponent} from './components/footer/footer.component';


@NgModule({
    declarations: [
        AppComponent,
        AddCategoryComponent,
        RetrieveCategoryComponent,
        LoginComponent,
        MapComponent,
        NavBarComponent,
        ConfirmationComponent,
        HomeComponent,
        FooterComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatToolbarModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
    ],
    providers: [HttpClientModule,
        CookieService,
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
    bootstrap: [AppComponent]
})
export class AppModule {
}
