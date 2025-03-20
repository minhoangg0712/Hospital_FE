import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminCreateDoctorComponent } from '../admin-create-doctor/admin-create-doctor.component';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
  standalone: true,
  imports: [AdminCreateDoctorComponent] // Import trực tiếp component
})
export class AdminHomeComponent {
  constructor(private router: Router) {}

  openCreateAccount() {
    this.router.navigateByUrl('/admin-create-doctor'); // Điều hướng trực tiếp
  }

  openListAccount() {
    this.router.navigateByUrl('/admin-doctor-list'); // Điều hướng trực tiếp
  }
}