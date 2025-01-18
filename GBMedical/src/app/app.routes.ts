import { Routes } from '@angular/router';
import { HomeComponent } from './_components/home/home.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/home' },
    { path: 'home', component: HomeComponent },



    { path: '**', redirectTo: '' } // 404 esetén visszairányítás a Home-ra, ez legyen legalul!!!
];
