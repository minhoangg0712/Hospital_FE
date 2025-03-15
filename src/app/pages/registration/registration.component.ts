import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Đảm bảo đường dẫn đúng

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      address: ['', [Validators.required]],
      cccd: ['', Validators.required],  // Đổi tên từ idCard thành cccd
      insuranceNumber: ['', Validators.required],  // Đổi tên từ insurance thành insuranceNumber
      password: ['', [Validators.required, Validators.minLength(6)]],
      gender: ['Male', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Đăng ký thành công:', response);
          this.router.navigate(['/login'], { queryParams: { registered: 'success' } });
        },
        error: (error) => {
          console.error('Lỗi đăng ký:', error);
          this.errorMessage = error.error?.error || 'Đăng ký thất bại. Vui lòng thử lại.';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      // Đánh dấu tất cả các trường là đã chạm để hiển thị validation
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      console.log('Form is invalid');
    }
  }
}