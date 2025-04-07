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
import { AdminHomeComponent } from './pages-admin/admin-home/admin-home.component';
import { AdminCreateDoctorComponent } from './pages-admin/admin-create-doctor/admin-create-doctor.component';
import { AdminDoctorListComponent } from './pages-admin/admin-doctor-list/admin-doctor-list.component';
import { RecordsListComponent } from './pages-doctor/records-list/records-list.component';
import { PatientListComponent } from './pages-doctor/patient-list/patient-list.component';
import { CreateMedicalRecordComponent } from './pages-doctor/create-medical-record/create-medical-record.component';
import { MedicalRecordsComponent } from './pages-doctor/medical-records/medical-records.component';
import { MedicalRecordDetailComponent } from './pages-doctor/medical-record-detail/medical-record-detail.component';
import { AuthGuard } from './guards/auth.guard';
import { DoctorScheduleComponent } from './pages-doctor/doctor-schedule/doctor-schedule.component';
import { ManagerGuard } from './guards/manager.guard';
import { PatientMedicalRecordsComponent } from './pages/patient-medical-records/patient-medical-records.component';
import { AppointmentHistoryComponent } from './pages/appointment-history/appointment-history.component';
import { DoctorLayoutComponent } from './component/doctor-layout/doctor-layout.component';
import { IntroductionComponent } from './pages/introduction/introduction.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'home', component: HomeComponent },
  { path: 'introduction', component: IntroductionComponent },
  { path: 'about', component: AboutComponent },
  { 
    path: 'doctor',
    component: DoctorLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeDoctorComponent },
      { path: 'profile', component: ProfileDoctorComponent },
      { path: 'patients', component: PatientListComponent },
      { path: 'medical-records', component: MedicalRecordsComponent },
      { path: 'medical-records/:id', component: MedicalRecordDetailComponent },
      { path: 'create-medical-record', component: CreateMedicalRecordComponent },
      { path: 'schedule', component: DoctorScheduleComponent },
      { path: 'records-list', component: RecordsListComponent },
      { path: 'patient-list', component: PatientListComponent }
    ]
  },
  { path: 'patient', component: HomePatientComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'appointment', component: AppointmentComponent, canActivate: [AuthGuard] },
  { path: 'medicine', component: MedicineComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'admin-home', component: AdminHomeComponent, canActivate: [AuthGuard] },
  { path: 'admin-create-doctor', component: AdminCreateDoctorComponent, canActivate: [AuthGuard] },
  { path: 'admin-doctor-list', component: AdminDoctorListComponent, canActivate: [AuthGuard] },
  { path: 'patient-medical-records', component: PatientMedicalRecordsComponent, canActivate: [AuthGuard] },
  { path: 'appointment-history', component: AppointmentHistoryComponent, canActivate: [AuthGuard] },
];