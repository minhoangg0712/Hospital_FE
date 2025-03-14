import { Component } from '@angular/core';
import { Router } from '@angular/router';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  captchaInput: string = '';
  captchaCode: string = '';

  constructor(private router: Router) {
    this.generateCaptcha(); // Tạo captcha khi tải trang
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

  updatePassword(event: Event): void {
    this.password = (event.target as HTMLInputElement).value;
  }

  updateCaptcha(event: Event): void {
    this.captchaInput = (event.target as HTMLInputElement).value;
  }

  /** ✅ Làm mới captcha */
refreshCaptcha(): void {
  this.generateCaptcha(); // Chỉ tạo lại captcha mới
}

  /** ✅ Kiểm tra hợp lệ */
  isValidForm(): boolean {
    if (!this.username || !this.email || !this.password || !this.captchaInput) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return false;
    }

    if (this.password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự!');
      return false;
    }

    if (this.captchaInput !== this.captchaCode) {
      alert('Mã captcha không chính xác!');
      this.refreshCaptcha();
      return false;
    }

    return true;
  }

  /** ✅ Gửi yêu cầu đổi mật khẩu */
  async onSubmit(): Promise<void> {
    if (!this.isValidForm()) return;

    try {
      await this.sendEmail(); // Gửi email xác nhận
      alert(`✅ Xác nhận đặt lại mật khẩu đã gửi tới: ${this.email}`);
      this.resetForm(); // Reset form sau khi gửi thành công
      this.router.navigate(['/login']); // Chuyển hướng về trang đăng nhập
    } catch (error) {
      console.error('❌ Lỗi gửi email:', error);
      alert('❌ Không thể gửi email, vui lòng thử lại sau!');
    }
  }

  /** ✅ Gửi email xác nhận bằng EmailJS */
  sendEmail(): Promise<EmailJSResponseStatus> {
    const templateParams = {
      from_name: 'Medica Hospital',
      to_name: this.username, // Tên người nhận
      to_email: this.email, // Email người nhận
      new_password: this.password, // ✅ Thêm mật khẩu mới
    };

    return emailjs.send(
      'service_bn345hv',      // Thay bằng Service ID của bạn
      'template_st5cpsf',     // Template ID của bạn
      templateParams,
      '_FxWXZ1gt_aF1SEzA'     // Public Key (User ID) của bạn
    );
  }

  /** ✅ Reset form về trạng thái ban đầu */
  resetForm(): void {
    this.username = '';
    this.email = '';
    this.password = '';
    this.captchaInput = '';
    this.generateCaptcha(); // Làm mới captcha
  }
}