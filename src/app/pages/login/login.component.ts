import { Component } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

  /** ✅ Xử lý đăng nhập */
  async login(): Promise<void> {
    if (!this.username || !this.password) {
      this.errorMessage = 'Vui lòng nhập đầy đủ tài khoản và mật khẩu!';
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username: this.username,
        password: this.password,
      });

      const { token, role } = response.data;

      // ✅ Lưu token và vai trò vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // ✅ Điều hướng theo vai trò
      if (role === 'DOCTOR') {
        this.router.navigate(['/doctor']);
      } else if (role === 'PATIENT') {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      this.errorMessage = 'Sai tài khoản hoặc mật khẩu';
    }
  }

  /** ✅ Điều hướng đến trang đăng ký */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  /** ✅ Điều hướng đến trang quên mật khẩu */
  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}