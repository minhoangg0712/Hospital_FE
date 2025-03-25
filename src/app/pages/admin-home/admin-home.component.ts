import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminCreateDoctorComponent } from '../admin-create-doctor/admin-create-doctor.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService, CreateDoctorRequest } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { AdminNavComponent } from '../../component/admin-nav/admin-nav.component';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminNavComponent] 
})
export class AdminHomeComponent implements OnInit {
  doctorForm: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private adminService: AdminService
  ) {
    this.doctorForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      departmentId: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // Kiểm tra quyền admin
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'ADM') {
      this.error = 'Bạn không có quyền truy cập trang này';
    }
  }

  onSubmit() {
    if (this.doctorForm.valid) {
      this.loading = true;
      this.error = null;
      this.success = null;

      const request: CreateDoctorRequest = {
        username: this.doctorForm.get('username')?.value,
        password: this.doctorForm.get('password')?.value,
        departmentId: parseInt(this.doctorForm.get('departmentId')?.value)
      };

      this.adminService.createDoctorAccount(request).subscribe({
        next: (response) => {
          this.success = 'Tạo tài khoản bác sĩ thành công';
          this.doctorForm.reset();
          this.loading = false;
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

  openCreateAccount() {
    this.router.navigateByUrl('/admin-create-doctor'); 
  }

  openListAccount() {
    this.router.navigateByUrl('/admin-doctor-list'); 
  }
}