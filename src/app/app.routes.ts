import { provideRouter,RouterModule,Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { HomeDoctorComponent } from './pages-doctor/home-doctor/home-doctor.component';
import { HomePatientComponent } from './pages/home-patient/home-patient.component';

export const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'doctor', component:HomeDoctorComponent},
  {path: 'patient', component:HomePatientComponent }
];
