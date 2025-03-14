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
                localStorage.setItem('userRole', payload.role);
                console.log('Role đã lưu:', payload.role);

                // Chuyển hướng dựa vào role từ token
                const role = payload.role.toUpperCase();
                if (role === 'DOCTOR' || role === 'ROLE_DOCTOR') {
                  console.log('Đang chuyển hướng đến trang bác sĩ...');
                  this.router.navigate(['/doctor']).then(
                    () => console.log('Chuyển hướng thành công đến trang bác sĩ'),
                    (err) => console.error('Lỗi chuyển hướng:', err)
                  );
                } else if (role === 'MGR' || role === 'ROLE_MGR') {
                  console.log('Đang chuyển hướng đến trang bác sĩ (MGR)...');
                  this.router.navigate(['/doctor']).then(
                    () => console.log('Chuyển hướng thành công đến trang bác sĩ'),
                    (err) => console.error('Lỗi chuyển hướng:', err)
                  );
                } else {
                  console.log('Đang chuyển hướng đến trang chủ...');
                  this.router.navigate(['']).then(
                    () => console.log('Chuyển hướng thành công đến trang chủ'),
                    (err) => console.error('Lỗi chuyển hướng:', err)
                  );
                }
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