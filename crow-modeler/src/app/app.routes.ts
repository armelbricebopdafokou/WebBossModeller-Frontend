import { Routes } from '@angular/router';
import { DrawScreenComponent } from './draw-screen/draw-screen.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { ProfileComponent } from './profile/profile.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'draw-screen', component: DrawScreenComponent },    
    { path: 'home', component: LandingPageComponent },
    { path: 'login', component: LoginScreenComponent},
    { path: 'profile', component: ProfileComponent},
    { path: 'register', component: RegisterPageComponent}
];
