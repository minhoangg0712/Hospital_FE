import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  avatarUrl: string = 'assets/avatar.jpg'; // Đường dẫn mặc định

  onFileSelected(event: any) {
    const file = event.target.files[0]; // Lấy file người dùng tải lên
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarUrl = e.target.result; // Hiển thị ảnh mới
      };
      reader.readAsDataURL(file);
    }
  }

  refreshImage() {
    this.avatarUrl = 'assets/avatar.jpg'; // Reset về ảnh mặc định
  }

  constructor(private fb: FormBuilder) {
    // Form thông tin cá nhân
    this.profileForm = this.fb.group({
      Id: ['', Validators.required],
      fullName: ['', Validators.required],
      dob: ['', Validators.required],
      major: ['', Validators.required],
      class: ['', Validators.required],
      phone: [''],
      mobile: [''],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      facebook: [''],
    });

    // Form thay đổi mật khẩu
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  updateProfile() {
    if (this.profileForm.valid) {
      console.log('Thông tin cá nhân:', this.profileForm.value);
      alert('Cập nhật thông tin thành công!');
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      const { newPassword, confirmPassword } = this.passwordForm.value;
      if (newPassword !== confirmPassword) {
        alert('Mật khẩu mới không khớp!');
        return;
      }
      console.log('Mật khẩu mới:', newPassword);
      alert('Đổi mật khẩu thành công!');
    }
  }
}