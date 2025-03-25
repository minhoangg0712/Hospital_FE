import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-nav">
      <div class="nav-header">
        <h2>Admin Panel</h2>
      </div>
      <nav class="nav-menu">
        <a [routerLink]="['/admin-home']" routerLinkActive="active" class="nav-item">
          <i class="fas fa-home"></i>
          <span>Trang chủ</span>
        </a>
        <a [routerLink]="['/admin-create-doctor']" routerLinkActive="active" class="nav-item">
          <i class="fas fa-user-plus"></i>
          <span>Tạo tài khoản</span>
        </a>
        <a [routerLink]="['/admin-doctor-list']" routerLinkActive="active" class="nav-item">
          <i class="fas fa-users"></i>
          <span>Quản lý bác sĩ</span>
        </a>
      </nav>
      <div class="nav-footer">
        <button class="logout-btn" (click)="logout()">
          <i class="fas fa-sign-out-alt"></i>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .admin-nav {
      width: 250px;
      height: 100vh;
      background: #2c3e50;
      color: white;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
    }

    .nav-header {
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid #34495e;
    }

    .nav-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #ecf0f1;
    }

    .nav-menu {
      flex: 1;
      padding: 20px 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 15px 20px;
      color: #ecf0f1;
      text-decoration: none;
      transition: background-color 0.3s;
    }

    .nav-item:hover {
      background: #34495e;
    }

    .nav-item.active {
      background: #3498db;
    }

    .nav-item i {
      margin-right: 10px;
      width: 20px;
      text-align: center;
    }

    .nav-footer {
      padding: 20px;
      border-top: 1px solid #34495e;
    }

    .logout-btn {
      width: 100%;
      padding: 10px;
      background: #e74c3c;
      border: none;
      color: white;
      border-radius: 5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s;
    }

    .logout-btn:hover {
      background: #c0392b;
    }

    .logout-btn i {
      margin-right: 8px;
    }
  `]
})
export class AdminNavComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
} 