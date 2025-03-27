import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { HomeComponent } from './pages/home/home.component';
import { HomeDoctorComponent } from './pages-doctor/home-doctor/home-doctor.component';
import { ProfileDoctorComponent } from './pages-doctor/profile-doctor/profile-doctor.component';
import { HomePatientComponent } from './pages/home-patient/home-patient.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { AppointmentComponent } from './pages/appointment/appointment.component';
import { MedicineComponent } from './pages/medicine/medicine.component';
import { CartComponent } from './pages/cart/cart.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { AdminCreateDoctorComponent } from './pages/admin-create-doctor/admin-create-doctor.component';
import { AdminDoctorListComponent } from './pages/admin-doctor-list/admin-doctor-list.component';
import { RecordsListComponent } from './pages-doctor/records-list/records-list.component';
import { PatientListComponent } from './pages-doctor/patient-list/patient-list.component';
import { CreateMedicalRecordComponent } from './pages-doctor/create-medical-record/create-medical-record.component';
import { MedicalRecordsComponent } from './pages-doctor/medical-records/medical-records.component';
import { MedicalRecordDetailComponent } from './pages-doctor/medical-record-detail/medical-record-detail.component';
import { AppointmentListComponent } from './pages/appointment-list/appointment-list.component';
import { AuthGuard } from './guards/auth.guard';
import { DoctorScheduleComponent } from './pages-doctor/doctor-schedule/doctor-schedule.component';
import { ManagerGuard } from './guards/manager.guard';
import { PatientMedicalRecordsComponent } from './pages/patient-medical-records/patient-medical-records.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'home', component: HomeComponent },
  { path: 'doctor', component: HomeDoctorComponent, canActivate: [AuthGuard] },
  { path: 'profile-doctor', component: ProfileDoctorComponent, canActivate: [AuthGuard] },
  { path: 'patient', component: HomePatientComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'appointment', component: AppointmentComponent, canActivate: [AuthGuard] },
  { path: 'medicine', component: MedicineComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'admin-home', component: AdminHomeComponent, canActivate: [AuthGuard] },
  { path: 'admin-create-doctor', component: AdminCreateDoctorComponent, canActivate: [AuthGuard] },
  { path: 'admin-doctor-list', component: AdminDoctorListComponent, canActivate: [AuthGuard] },
  { path: 'records-list', component: RecordsListComponent, canActivate: [AuthGuard] },
  { path: 'patient-list', component: PatientListComponent, canActivate: [AuthGuard] },
  { path: 'create-medical-record', component: CreateMedicalRecordComponent, canActivate: [AuthGuard] },
  { path: 'medical-records', component: MedicalRecordsComponent, canActivate: [AuthGuard] },
  { path: 'medical-records/:id', component: MedicalRecordDetailComponent, canActivate: [AuthGuard] },
  { path: 'appointments', component: AppointmentListComponent, canActivate: [ManagerGuard] },
  { path: 'schedule', component: DoctorScheduleComponent, canActivate: [AuthGuard] },
  { path: 'doctor/schedule', component: DoctorScheduleComponent },
  { path: 'patient-medical-records', component: PatientMedicalRecordsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/home' }
];
