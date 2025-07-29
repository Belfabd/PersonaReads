import { Routes } from '@angular/router';
import {LoginComponent} from "./components/auth/login/login.component";
import {RegisterComponent} from "./components/auth/register/register.component";
import {BoardingComponent} from "./components/boarding/boarding.component";
import {HomeComponent} from "./components/home/home.component";
import {AuthGuard} from "./services/auth.guard";

export const routes: Routes = [
    {
        path: '',
        title: 'Boarding',
        component: BoardingComponent,
    },
    {
        path: 'login',
        title: 'Login',
        component: LoginComponent,
    },
    {
        path: 'register',
        title: 'Register',
        component: RegisterComponent,
    },
    {
        path: 'dashboard',
        title: 'Home',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
];
