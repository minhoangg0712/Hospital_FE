import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminNavComponent } from '../../component/admin-nav/admin-nav.component';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-create-doctor',
  templateUrl: './admin-create-doctor.component.html',
  styleUrls: ['./admin-create-doctor.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminNavComponent],
})
export class AdminCreateDoctorComponent {
  doctorForm: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  departments: string[] = [
    'Tim mạch',
    'Khoa thần kinh',    
    'Khoa nhi',             
    'Khoa da liễu',        
    'Khoa phục hồi chức năng',           
    'Khoa dinh dưỡng',
  ];

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private adminService: AdminService
  ) {
    this.doctorForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      department: ['', Validators.required]
    });
  }

  createDoctor() {
    if (this.doctorForm.valid) {
      this.loading = true;
      this.error = null;
      this.success = null;

      const request = {
        username: this.doctorForm.get('username')?.value,
        password: this.doctorForm.get('password')?.value,
        departmentId: this.departments.indexOf(this.doctorForm.get('department')?.value) + 1
      };

      this.adminService.createDoctorAccount(request).subscribe({
        next: () => {
          this.success = 'Tài khoản bác sĩ đã được tạo thành công!';
          this.doctorForm.reset();
          this.loading = false;
          setTimeout(() => {
            this.router.navigateByUrl('/admin-doctor-list');
          }, 1500);
        },
        error: (error) => {
          this.error = error.error?.error || 'Có lỗi xảy ra khi tạo tài khoản';
          this.loading = false;
        }
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.doctorForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Trường này là bắt buộc';
    }
    if (control?.hasError('minlength')) {
      return `Độ dài tối thiểu là ${control.errors?.['minlength'].requiredLength} ký tự`;
    }
    return '';
  }
} 