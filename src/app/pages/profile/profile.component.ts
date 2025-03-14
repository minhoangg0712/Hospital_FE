import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router) {
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

  // Xử lý chọn ảnh đại diện
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Reset ảnh đại diện
  refreshImage() {
    this.avatarUrl = 'assets/avatar.jpg';
  }

  // Cập nhật thông tin cá nhân
  updateProfile() {
    if (this.profileForm.valid) {
      console.log('Thông tin cá nhân:', this.profileForm.value);
      alert('Cập nhật thông tin thành công!');
    }
  }

  // Đổi mật khẩu
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

  gotoPatient(){
    this.router.navigate(['/patient']);
  }

  goToMedicine() {
    this.router.navigate(['/medicine']);
  }

  goToAppointment() {
    this.router.navigate(['/appointment']);
  }

  goToCartComponent() {
    this.router.navigate(['/cart']);
  }
}
