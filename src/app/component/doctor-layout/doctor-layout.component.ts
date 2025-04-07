import { Component, OnInit } from '@angular/core';
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
        <ul class="nav-links">
          <li>
            <a (click)="goToHomeDoctor()" class="nav-item" [class.active]="currentRoute === '/doctor'">
              <i class="fas fa-home"></i>
              <span>Trang chủ</span>
            </a>
          </li>
          <li>
            <a (click)="goToProfileDoctor()" class="nav-item" [class.active]="currentRoute === '/doctor/profile'">
              <i class="fas fa-user-md"></i>
              <span>Thông tin cá nhân</span>
            </a>
          </li>
          <li>
            <a (click)="goToPatientList()" class="nav-item" [class.active]="currentRoute === '/doctor/patient-list'">
              <i class="fas fa-users"></i>
              <span>Danh sách bệnh nhân</span>
            </a>
          </li>
          <li>
            <a (click)="goToMedicalRecords()" class="nav-item" [class.active]="currentRoute === '/doctor/medical-records'">
              <i class="fas fa-file-medical"></i>
              <span>Hồ sơ bệnh án</span>
            </a>
          </li>
          <li>
            <a (click)="goToSchedule()" class="nav-item" [class.active]="currentRoute === '/doctor/schedule'">
              <i class="fas fa-calendar-check"></i>
              <span>Lịch hẹn khám</span>
            </a>
          </li>
          <li>
            <a (click)="goToCreateMedicalRecord()" class="nav-item" [class.active]="currentRoute === '/doctor/create-medical-record'">
              <i class="fas fa-file-medical-alt"></i>
              <span>Tạo hồ sơ khám</span>
            </a>
          </li>
        </ul>
        
        <div class="sidebar-footer">
          <button class="logout-btn" (click)="openLogoutModal()">
            <i class="fas fa-sign-out-alt"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </nav>
      
      <!-- Logout confirmation modal -->
      <div class="modal-overlay" *ngIf="isLogoutModalOpen" (click)="closeLogoutModal()">
        <div class="modal-content" (click)="$event.stopPropagation()"> 
          <div class="modal-header">
            <i class="fas fa-sign-out-alt modal-icon"></i>
            <h3>Xác nhận đăng xuất</h3>
          </div>
          <p>Bạn có chắc chắn muốn đăng xuất không?</p>
          <div class="modal-buttons">
            <button class="cancel" (click)="closeLogoutModal()">Hủy</button>
            <button class="confirm" (click)="logout()">Đăng xuất</button>
          </div>
        </div>
      </div>
      <main class="main-content">
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    /* Base layout */
    .doctor-layout {
      display: flex;
      min-height: 100vh;
      background-color: #f8f9fa;
      font-family: 'Roboto', sans-serif;
    }

    /* Sidebar styling */
    .sidebar {
      width: 280px;
      background: #14656E;
      color: white;
      padding: 0;
      box-shadow: 3px 0 10px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 10;
    }

    /* Logo area */
    .logo {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .logo-img {
      width: 60px;
      height: 60px;
      margin-bottom: 10px;
    }

    .logo h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    /* Navigation links */
    .nav-links {
      list-style: none;
      padding: 10px 0;
      margin: 0;
      flex: 1;
    }

    .nav-links li {
      margin: 8px 0;
    }

    .nav-item {
      color: rgba(255,255,255,0.9);
      text-decoration: none;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      transition: all 0.3s ease;
      cursor: pointer;
      border-radius: 4px;
      margin: 0 10px;
    }

    .nav-item i {
      margin-right: 15px;
      font-size: 18px;
      width: 20px;
      text-align: center;
      transition: transform 0.2s ease;
    }

    .nav-item:hover {
      background-color: rgba(255,255,255,0.1);
      color: white;
    }

    .nav-item:hover i {
      transform: translateX(3px);
    }

    .nav-item.active {
      background-color: rgba(255,255,255,0.2);
      color: white;
      font-weight: 500;
    }

    /* Sidebar footer */
    .sidebar-footer {
      padding: 15px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .logout-btn {
      width: 100%;
      padding: 12px;
      background: rgba(255 0 24 / 70%);
      border: 1px solid rgba(220, 53, 69, 0.3);
      border-radius: 4px;
      color: rgba(255,255,255,0.9);
      text-align: center;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .logout-btn:hover {
      background-color: rgba(255 0 24 / 55%);
      color: white;
    }

    .logout-btn i {
      margin-right: 10px;
    }

    /* Main content area */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Top bar */
    .top-bar {
      background: white;
      padding: 15px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      position: relative;
      z-index: 5;
    }

    .page-title h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
      color: #333;
    }

    .user-actions {
      display: flex;
      align-items: center;
      gap: 25px;
    }

    .badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #dc3545;
      color: white;
      border-radius: 50%;
      padding: 3px 6px;
      font-size: 11px;
      min-width: 18px;
      text-align: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    /* Content wrapper */
    .content-wrapper {
      padding: 30px;
      flex: 1;
      overflow-y: auto;
      background-color: #f8f9fa;
    }

    /* Modal styling */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(3px);
    }

    .modal-content {
      background-color: white;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      width: 350px;
      text-align: center;
      animation: modalFadeIn 0.3s ease;
    }

    @keyframes modalFadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    .modal-header {
      margin-bottom: 20px;
    }

    .modal-icon {
      display: block;
      font-size: 36px;
      color: #dc3545;
      margin-bottom: 15px;
    }

    .modal-header h3 {
      margin: 0;
      color: #333;
      font-weight: 500;
    }

    .modal-content p {
      margin: 15px 0 25px;
      color: #555;
      font-size: 16px;
    }

    .modal-buttons {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 20px;
    }

    .modal-buttons button {
      padding: 10px 25px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .modal-buttons .confirm {
      background-color: #dc3545;
      color: white;
    }

    .modal-buttons .confirm:hover {
      background-color: #c82333;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .modal-buttons .cancel {
      background-color: #e9ecef;
      color: #495057;
    }

    .modal-buttons .cancel:hover {
      background-color: #dde2e6;
    }
  `]
})
export class DoctorLayoutComponent implements OnInit {
  currentRoute: string = '';
  isLoggedIn: boolean = false;
  isLogoutModalOpen: boolean = false;
  notificationCount: number = 2; // Example notification count
  currentDate: Date = new Date();

  constructor(private router: Router) { }

  ngOnInit() {
    // Kiểm tra trạng thái đăng nhập
    this.checkLoginStatus();
    
    // Track current route for active link highlighting
    this.currentRoute = this.router.url;
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  getPageTitle(): string {
    // Return a title based on current route
    if (this.currentRoute === '/doctor') return 'Trang Chủ';
    if (this.currentRoute === '/doctor/profile') return 'Thông Tin Cá Nhân';
    if (this.currentRoute === '/doctor/patient-list') return 'Danh Sách Bệnh Nhân';
    if (this.currentRoute === '/doctor/medical-records') return 'Hồ Sơ Bệnh Án';
    if (this.currentRoute === '/doctor/schedule') return 'Lịch Hẹn Khám';
    if (this.currentRoute === '/doctor/create-medical-record') return 'Tạo Hồ Sơ Khám';
    return 'Phòng Khám';
  }

  goToHomeDoctor(): void {
    this.router.navigate(['/doctor']);
  }
  
  goToProfileDoctor(): void {
    this.router.navigate(['/doctor/profile']);
  }
  
  goToPatientList(): void {
    this.router.navigate(['/doctor/patient-list']);
  }
  
  goToMedicalRecords(): void {
    this.router.navigate(['/doctor/medical-records']);
  }
  
  goToSchedule(): void {
    this.router.navigate(['/doctor/schedule']);
  }
  
  goToCreateMedicalRecord(): void {
    this.router.navigate(['/doctor/create-medical-record']);
  }

  private checkLoginStatus() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  }

  openLogoutModal() {
    this.isLogoutModalOpen = true;
  }

  closeLogoutModal() {
    this.isLogoutModalOpen = false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.isLogoutModalOpen = false;
    this.router.navigate(['/']);
  }
}