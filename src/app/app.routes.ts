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
import { AuthGuard } from '../guards/auth.guard';
import { ProfileDoctorComponent } from './pages-doctor/profile-doctor/profile-doctor.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'doctor', component: HomeDoctorComponent, canActivate: [AuthGuard]},
  {path: 'patient', component: HomePatientComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'appointment', component: AppointmentComponent, canActivate: [AuthGuard]},
  {path: 'medicine', component: MedicineComponent, canActivate: [AuthGuard]},
  {path: 'cart', component: CartComponent, canActivate: [AuthGuard]},
  {path: 'profile-doctor', component: ProfileDoctorComponent, canActivate: [AuthGuard]}
];
