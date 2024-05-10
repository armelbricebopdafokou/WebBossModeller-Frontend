import { Routes } from '@angular/router';
import { DrawScreenComponent } from './draw-screen/draw-screen.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: 'draw-screen', component: DrawScreenComponent },
    { path: 'profile', component: ProfileComponent},
];
