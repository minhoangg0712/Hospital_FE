import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, UserDTO } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

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
  isEditing: boolean = false;
  isLogoutModalOpen: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
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
      gender: ['', Validators.required],
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
      // Log thông tin từ token
      const token = localStorage.getItem('token');
      if (token) {
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('Thông tin từ token:', {
          userId: payload.userId || payload.sub,
          role: payload.role,
          username: payload.username
        });
      }

      this.userService.getCurrentUserProfile().subscribe({
        next: (data: UserDTO) => {
          console.log('Dữ liệu user nhận được:', data);
          this.currentUser = data;
          this.updateProfileForm(data);
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Lỗi khi tải thông tin:', error);
          console.error('Chi tiết lỗi:', error.error);
          if (error.status === 401) {
            this.errorMessage = error.message || 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
            this.router.navigate(['/login']);
          } else if (error.status === 403) {
            this.errorMessage = error.message || 'Bạn không có quyền truy cập thông tin này.';
          } else if (error.status === 400) {
            this.errorMessage = error.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
          } else {
            this.errorMessage = error.message || 'Không thể tải thông tin cá nhân. Vui lòng thử lại sau.';
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
      gender: user.gender,
      email: user.email,
      address: user.address,
      insuranceNumber: user.insuranceNumber
    });
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Tạo object UserDTO từ form data
      const updatedUser: UserDTO = {
        userId: this.currentUser?.userId || 0,
        name: this.profileForm.get('fullName')?.value,
        phone: this.profileForm.get('phone')?.value,
        email: this.profileForm.get('email')?.value,
        gender: this.profileForm.get('gender')?.value,
        roleCode: this.currentUser?.roleCode || 'ROLE_PATIENT',
        departmentId: this.currentUser?.departmentId || 0,
        cccd: this.profileForm.get('cccd')?.value,
        insuranceNumber: this.profileForm.get('insuranceNumber')?.value,
        address: this.profileForm.get('address')?.value
      };

      console.log('Sending update request with data:', updatedUser);

      this.userService.updateUserProfile(updatedUser).subscribe({
        next: (response) => {
          console.log('Update response:', response);
          this.currentUser = response;
          this.isEditing = false;
          this.successMessage = 'Cập nhật thông tin thành công!';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Lỗi khi cập nhật:', error);
          this.errorMessage = error.message;
        },
        complete: () => {
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

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing && this.currentUser) {
      this.updateProfileForm(this.currentUser);
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    if (this.currentUser) {
      this.updateProfileForm(this.currentUser);
    }
  }

  openLogoutModal(): void {
    this.isLogoutModalOpen = true;
  }

  closeLogoutModal(): void {
    this.isLogoutModalOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }

  goToAppointmentHistory() {
    this.router.navigateByUrl('/appointment-history');
  }
  goToPatientMedicalRecords() {
    this.router.navigateByUrl('/patient-medical-records');}
}