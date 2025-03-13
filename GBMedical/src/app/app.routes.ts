import { Routes } from '@angular/router';
import { HomeComponent } from './_components/home/home.component';
import { ContactComponent } from './_components/contact/contact.component';
import { SpecialistsComponent } from './_components/specialists/specialists.component';
import { LoginComponent } from './_components/login/login.component';
import { RegisterComponent } from './_components/register/register.component';
import { ServicesComponent } from './_components/services/services.component';
import { CalendarComponent } from './_components/calendar/calendar.component';
import { ForgotPasswordComponent } from './_components/forgot-password/forgot-password.component';
import { NewPasswordComponent } from './_components/new-password/new-password.component';
import { AdminComponent } from './_components/admin/admin.component';
import { BookingComponent } from './_components/booking/booking.component';
import { ChevronUpComponent } from './_components/chevron-up/chevron-up.component';
import { VerifyComponent } from './_components/verify/verify.component';


export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/home' },
    { path: 'home', component: HomeComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'specialists', component: SpecialistsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'services', component: ServicesComponent },
    { path: 'calendar/:id', component: CalendarComponent },
    { path: 'calendar', component: CalendarComponent },
    { path: 'booking', component: BookingComponent },
    { path: 'forgotPassword', component: ForgotPasswordComponent },
    { path: 'newPassword', component: NewPasswordComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'chevron-up', component: ChevronUpComponent },
    { path: 'verify', component: VerifyComponent },



    { path: '**', redirectTo: '/home' } // 404 esetén visszairányítás a Home-ra, ez legyen legalul!!!
];
