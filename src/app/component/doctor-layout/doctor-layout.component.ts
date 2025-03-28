import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <div class="doctor-layout">
      <nav class="sidebar">
        <div class="logo">
          <h2>Bệnh viện</h2>
        </div>
        <ul class="nav-links">
          <li><a (click)="goToHomeDoctor()">Trang chủ</a></li>
          <li><a (click)="goToProfileDoctor()">Thông tin cá nhân</a></li>
          <li><a (click)="GoToPatientList()">Danh sách bệnh nhân</a></li>
          <li><a (click)="GoToMedicalRecords()">Hồ sơ bệnh án</a></li>
          <li><a (click)="GoToSchedule()">Lịch hẹn khám</a></li>
          <li><a (click)="GoToCreateMedicalRecord()">Tạo hồ sơ khám</a></li>
        </ul>
      </nav>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .doctor-layout {
      display: flex;
      min-height: 100vh;
    }
    .sidebar {
      width: 250px;
      background-color: #14656E;
      color: white;
      padding: 20px;
    }
    .logo {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #34495e;
    }
    .nav-links {
      list-style: none;
      padding: 0;
      margin: 20px 0;
    }
    .nav-links li {
      margin: 10px 0;
    }
    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 10px;
      display: block;
      border-radius: 5px;
    }
    .nav-links a:hover, .nav-links a.active {
      background-color: #34495e;
    }
    .main-content {
      flex: 1;
      padding: 20px;
      background-color: #f5f6fa;
    }
    .breadcrumb {
      margin-bottom: 20px;
      padding: 10px;
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .breadcrumb a {
      color: #2c3e50;
      text-decoration: none;
    }
  `]
})
export class DoctorLayoutComponent {
  currentRoute: string = '';

  constructor(private router: Router) { }
    goToHomeDoctor(): void {
      this.router.navigate(['/doctor/home-doctor']);
  }
    goToProfileDoctor(): void {
    this.router.navigate(['/doctor/profile']);
  }
    GoToPatientList(): void {
    this.router.navigate(['/doctor/patient-list']);
  }
    GoToMedicalRecords(): void {
    this.router.navigate(['/doctor/medical-records']);
  }
    GoToSchedule(): void {
    this.router.navigate(['/doctor/schedule']);
  }
  GoToCreateMedicalRecord(): void {
    this.router.navigate(['/doctor/create-medical-record']);
  }
} 