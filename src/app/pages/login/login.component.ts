import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']   // <- sửa styleUrl -> styleUrls
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Xóa thông tin cũ khi vào trang đăng nhập
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  }

  /** Decode phần payload của JWT (hỗ trợ URL-safe + padding) */
  private decodeJWTPayload(token: string): any {
    try {
      const base = token.split('.')[1] ?? '';
      const fixed = base.replace(/-/g, '+').replace(/_/g, '/');
      const pad = fixed + '==='.slice((fixed.length + 3) % 4);
      const json = atob(pad);
      return JSON.parse(json);
    } catch {
      return {};
    }
  }

  /** Lấy role từ nhiều field và chuẩn hóa (bỏ prefix ROLE_) */
  private extractRole(p: any): string {
    const candidates = [
      p?.role, p?.role_code, p?.roleCode,
      p?.role_group, p?.roleGroup,
      p?.authority, Array.isArray(p?.authorities) ? p.authorities[0] : null,
      Array.isArray(p?.roles) ? p.roles[0] : null
    ];
    let raw = (candidates.find(x => typeof x === 'string' && x.trim().length) ?? 'PATIENT')
      .toString().toUpperCase().trim();
    if (raw.startsWith('ROLE_')) raw = raw.slice(5); // ROLE_AST -> AST
    return raw; // ADM | AST | MGR | EMP | PATIENT | DOCTOR ...
  }

  onLogin(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    console.log('Đang gửi request đăng nhập với:', { username: this.username });

    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        try {
          const token = res?.token;
          if (!token) throw new Error('Không nhận được token');
          localStorage.setItem('token', token);

          const payload = this.decodeJWTPayload(token);
          console.log('JWT payload:', payload);

          const role = this.extractRole(payload); // đã chuẩn hóa
          const uid  = payload?.userId ?? payload?.user_id ?? payload?.sub;
          if (uid != null) localStorage.setItem('userId', String(uid));

          switch (role) {
            case 'ADM':
            case 'ADMIN':
              localStorage.setItem('userRole', 'ADM');
              this.router.navigate(['/admin-home']);
              break;

            case 'AST':
            case 'ASSISTANT':
              localStorage.setItem('userRole', 'AST');
              this.router.navigate(['/assistant']);
              break;

            case 'MGR':
            case 'DOCTOR':
              localStorage.setItem('userRole', 'MGR');
              this.router.navigate(['/doctor']);
              break;

            case 'EMP':
            case 'PATIENT':
              localStorage.setItem('userRole', 'PATIENT');
              this.router.navigate(['/patient']);
              break;

            default:
              // Fallback an toàn
              localStorage.setItem('userRole', 'PATIENT');
              this.router.navigate(['/patient']);
          }
        } catch (e) {
          console.error('Lỗi khi xử lý token:', e);
          this.errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại.';
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userId');
        }
      },
      error: (err) => {
        console.error('Chi tiết lỗi đăng nhập:', err);
        this.errorMessage = err?.status === 401
          ? 'Tên đăng nhập hoặc mật khẩu không đúng'
          : (err?.error?.message || 'Đăng nhập thất bại. Vui lòng thử lại sau.');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
