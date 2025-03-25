import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Xóa token và thông tin user cũ khi vào trang đăng nhập
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
  }

  onLogin() {
    // Kiểm tra form trước khi gửi
    if (!this.username || !this.password) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    console.log('Đang gửi request đăng nhập với:', { username: this.username });

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Response đầy đủ từ API:', response);
        
        try {
          // Kiểm tra response
          if (!response) {
            throw new Error('Không nhận được phản hồi từ server');
          }

          // Giải mã token để lấy thông tin role
          const token = response?.token;
          if (token) {
            console.log('Token nhận được:', token);
            localStorage.setItem('token', token);
            
            // Giải mã token (phần payload)
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log('Token payload:', payload);
              
              // Lưu role vào localStorage
              if (payload.role) {
                const role = payload.role.toUpperCase();
                console.log('Role từ payload:', role);

                // Lưu userId
                if (payload.userId) {
                  console.log('Lưu userId:', payload.userId);
                  localStorage.setItem('userId', payload.userId.toString());
                }

                if (role === 'ADMIN' || role === 'ROLE_ADMIN' || role === 'ROLE_ADM' || role === 'ADM') {
                  console.log('Đang set role ADMIN...');
                  localStorage.setItem('userRole', 'ADM');
                  console.log('Đang chuyển hướng đến /admin-home...');
                  this.router.navigate(['/admin-home']);
                } else if (role === 'DOCTOR' || role === 'ROLE_DOCTOR') {
                  console.log('Đang set role DOCTOR...');
                  localStorage.setItem('userRole', 'DOCTOR');
                  this.router.navigate(['/doctor']);
                } else if (role === 'MGR' || role === 'ROLE_MGR') {
                  console.log('Đang set role MGR...');
                  localStorage.setItem('userRole', 'MGR');
                  this.router.navigate(['/doctor']);
                } else if (role === 'ROLE_EMP' || role === 'EMP') {
                  console.log('Đang set role EMP...');
                  localStorage.setItem('userRole', 'EMP');
                  this.router.navigate(['/patient']);
                } else {
                  console.log('Đang set role PATIENT...');
                  localStorage.setItem('userRole', 'PATIENT');
                  this.router.navigate(['/patient']);
                }
                
                console.log('Role sau khi lưu:', localStorage.getItem('userRole'));
                console.log('UserId sau khi lưu:', localStorage.getItem('userId'));
              } else {
                throw new Error('Không tìm thấy role trong token');
              }
            } else {
              throw new Error('Token không hợp lệ');
            }
          } else {
            throw new Error('Không nhận được token từ response');
          }
        } catch (error) {
          console.error('Lỗi khi xử lý token:', error);
          this.errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại.';
          // Xóa token nếu có lỗi
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('user');
        }
      },
      error: (error) => {
        console.error('Chi tiết lỗi đăng nhập:', error);
        if (error.status === 401) {
          this.errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng';
        } else {
          this.errorMessage = error.error?.message || 'Đăng nhập thất bại. Vui lòng thử lại sau.';
        }
        // Xóa token nếu có lỗi
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('user');
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}