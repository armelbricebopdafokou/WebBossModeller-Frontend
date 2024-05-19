import { Routes } from '@angular/router';
import { DrawScreenComponent } from './draw-screen/draw-screen.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: 'draw-screen', component: DrawScreenComponent },
    { path: 'login', component: LoginScreenComponent},
    { path: 'profile', component: ProfileComponent},
];
