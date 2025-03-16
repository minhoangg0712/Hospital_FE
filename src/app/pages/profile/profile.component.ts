import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, UserDTO } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: UserDTO | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.profileForm = this.fb.group({
      cccd: ['', Validators.required],
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      insuranceNumber: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.userService.getCurrentUserProfile().subscribe({
        next: (data: UserDTO) => {
          this.currentUser = data;
          this.updateProfileForm(data);
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Lỗi khi tải thông tin:', error);
          if (error.status === 401) {
            this.errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
            this.router.navigate(['/login']);
          } else {
            this.errorMessage = 'Không thể tải thông tin cá nhân. Vui lòng thử lại sau.';
          }
          this.isLoading = false;
        }
      });
    } catch (error: any) {
      console.error('Lỗi:', error);
      this.errorMessage = error.message || 'Có lỗi xảy ra';
      this.isLoading = false;
    }
  }

  private updateProfileForm(user: UserDTO): void {
    this.profileForm.patchValue({
      cccd: user.cccd,
      fullName: user.name,
      phone: user.phone,
      email: user.email,
      address: user.address,
      insuranceNumber: user.insuranceNumber
    });
  }

  updateProfile(): void {
    if (this.profileForm.valid && this.currentUser) {
      this.isLoading = true;
      this.errorMessage = '';

      const updatedUser: UserDTO = {
        ...this.currentUser,
        ...this.profileForm.value,
        name: this.profileForm.value.fullName
      };

      this.userService.updateUserProfile(updatedUser).subscribe({
        next: (response: UserDTO) => {
          this.currentUser = response;
          this.successMessage = 'Cập nhật thông tin thành công!';
          this.isLoading = false;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error: any) => {
          console.error('Lỗi khi cập nhật:', error);
          this.errorMessage = 'Không thể cập nhật thông tin. Vui lòng thử lại sau.';
          this.isLoading = false;
        }
      });
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { oldPassword, newPassword } = this.passwordForm.value;

      this.userService.changePassword(oldPassword, newPassword).subscribe({
        next: () => {
          this.successMessage = 'Đổi mật khẩu thành công!';
          this.passwordForm.reset();
          this.isLoading = false;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error: any) => {
          console.error('Lỗi khi đổi mật khẩu:', error);
          if (error.status === 401) {
            this.errorMessage = 'Mật khẩu cũ không đúng!';
          } else {
            this.errorMessage = 'Không thể đổi mật khẩu. Vui lòng thử lại sau.';
          }
          this.isLoading = false;
        }
      });
    }
  }
}
