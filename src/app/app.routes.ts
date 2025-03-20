import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { HomeDoctorComponent } from './pages-doctor/home-doctor/home-doctor.component';
import { HomePatientComponent } from './pages/home-patient/home-patient.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { AppointmentComponent} from './pages/appointment/appointment.component';
import { MedicineComponent} from './pages/medicine/medicine.component';
import { CartComponent} from './pages/cart/cart.component';

export const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'doctor', component:HomeDoctorComponent},
  {path: 'patient', component:HomePatientComponent},
  {path: 'profile', component:ProfileComponent},
  {path: 'forgot-password', component:ForgotPasswordComponent},
  {path: 'appointment', component:AppointmentComponent},
  {path: 'medicine', component:MedicineComponent},
  {path : 'cart', component:CartComponent},
];
