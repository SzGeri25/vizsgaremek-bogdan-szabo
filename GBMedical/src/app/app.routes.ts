import { Routes } from '@angular/router';
import { HomeComponent } from './_components/home/home.component';
import { ConnectionComponent } from './_components/connection/connection.component';
import { SpecialistsComponent } from './_components/specialists/specialists.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/home' },
    { path: 'home', component: HomeComponent },
    { path: 'connection', component: ConnectionComponent },
    {path: 'specialists', component: SpecialistsComponent},



    { path: '**', redirectTo: '' } // 404 esetén visszairányítás a Home-ra, ez legyen legalul!!!
];
