import { Routes } from '@angular/router';
import { HomeComponent } from './_components/home/home.component';
import { ContactComponent } from './_components/contact/contact.component';
import { SpecialistsComponent } from './_components/specialists/specialists.component';
import { LoginComponent } from './_components/login/login.component';
import { RegisterComponent } from './_components/register/register.component';


export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/home' },
    { path: 'home', component: HomeComponent },
    { path: 'contact', component: ContactComponent },
    {path: 'specialists', component: SpecialistsComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},


    { path: '**', redirectTo: '' } // 404 esetén visszairányítás a Home-ra, ez legyen legalul!!!
];
