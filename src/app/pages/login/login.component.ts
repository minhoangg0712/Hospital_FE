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
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

  async login() {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username: this.username,
        password: this.password
      });

      const { token, role } = response.data;

      // Lưu token vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Chuyển hướng dựa vào vai trò
      if (role === 'DOCTOR') {
        this.router.navigate(['/doctor']);
      } else if (role === 'PATIENT') {
        this.router.navigate(['']);
      }
    } catch (error) {
      console.error('Đăng nhập thất bại', error);
      this.errorMessage = 'Sai tài khoản hoặc mật khẩu';
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
