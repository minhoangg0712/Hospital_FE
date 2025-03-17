import { Component } from '@angular/core';
import { Router } from '@angular/router';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  username: string = '';
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  captchaInput: string = '';
  captchaCode: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.generateCaptcha();
  }

  /** ✅ Tạo mã captcha ngẫu nhiên (6 ký tự số) */
  generateCaptcha(): void {
    const characters = '0123456789';
    this.captchaCode = Array.from({ length: 6 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
  }

  /** ✅ Cập nhật giá trị input */
  updateUsername(event: Event): void {
    this.username = (event.target as HTMLInputElement).value;
  }

  updateEmail(event: Event): void {
    this.email = (event.target as HTMLInputElement).value;
  }

  updateNewPassword(event: Event): void {
    this.newPassword = (event.target as HTMLInputElement).value;
  }

  updateConfirmPassword(event: Event): void {
    this.confirmPassword = (event.target as HTMLInputElement).value;
  }

  updateCaptcha(event: Event): void {
    this.captchaInput = (event.target as HTMLInputElement).value;
  }

  /** ✅ Làm mới captcha */
  refreshCaptcha(): void {
    this.generateCaptcha();
  }

  /** ✅ Kiểm tra hợp lệ */
  isValidForm(): boolean {
    if (!this.username || !this.email || !this.newPassword || !this.confirmPassword || !this.captchaInput) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin!';
      return false;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự!';
      return false;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu xác nhận không khớp!';
      return false;
    }

    if (this.captchaInput !== this.captchaCode) {
      this.errorMessage = 'Mã captcha không chính xác!';
      this.refreshCaptcha();
      return false;
    }

    return true;
  }

  /** ✅ Gửi yêu cầu đổi mật khẩu */
  async onSubmit(): Promise<void> {
    if (!this.isValidForm()) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      // Gọi API đổi mật khẩu
      this.authService.forgotPassword({
        username: this.username,
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword
      }).subscribe({
        next: async () => {
          // Nếu API thành công, gửi email xác nhận
          await this.sendEmail();
          this.successMessage = 'Đặt lại mật khẩu thành công! Vui lòng kiểm tra email của bạn.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('Lỗi đặt lại mật khẩu:', error);
          if (error.status === 404) {
            this.errorMessage = 'Tài khoản không tồn tại!';
          } else {
            this.errorMessage = error.error?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại sau.';
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Lỗi gửi email:', error);
      this.errorMessage = 'Không thể gửi email xác nhận. Vui lòng thử lại sau.';
      this.isLoading = false;
    }
  }

  /** ✅ Gửi email xác nhận bằng EmailJS */
  sendEmail(): Promise<EmailJSResponseStatus> {
    const templateParams = {
      from_name: 'Medica Hospital',
      to_name: this.username,
      to_email: this.email,
      new_password: this.newPassword,
    };

    return emailjs.send(
      'service_bn345hv',
      'template_st5cpsf',
      templateParams,
      '_FxWXZ1gt_aF1SEzA'
    );
  }

  /** ✅ Reset form về trạng thái ban đầu */
  resetForm(): void {
    this.username = '';
    this.email = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.captchaInput = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.generateCaptcha();
  }
}