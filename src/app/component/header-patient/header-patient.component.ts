import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-patient',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-patient.component.html',
  styleUrls: ['./header-patient.component.css'], 
})
export class HeaderPatientComponent {
  isLogoutModalOpen = false; 

  constructor(private router: Router) {} 

  /** ✅ Mở modal xác nhận đăng xuất */
  openLogoutModal(): void {
    this.isLogoutModalOpen = true;
  }

  /** ✅ Đóng modal xác nhận đăng xuất */
  closeLogoutModal(): void {
    this.isLogoutModalOpen = false;
  }

  /** ✅ Xử lý đăng xuất và điều hướng về trang chủ */
  logout(): void {
    console.log('Người dùng đã đăng xuất');
    this.isLogoutModalOpen = false;
    this.router.navigate(['']);
  }

  /** ✅ Điều hướng đến trang giỏ hàng */
  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}