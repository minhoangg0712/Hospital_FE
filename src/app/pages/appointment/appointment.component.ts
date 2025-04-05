import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AppointmentService, AppointmentRequest, Appointment } from '../../services/appointment.service';
import { DepartmentService, Department } from '../../services/department.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  appointmentForm: FormGroup;
  isRegisterForRelative = false;
  departments: Department[] = [];
  availableSlots: Record<string, string[]> = {};
  showPopup: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private departmentService: DepartmentService,
    private authService: AuthService,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      registerFor: ['self', Validators.required],
      relativeName: [''],
      relativeCCCD: [''],
      departmentId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(2)]],
    });
    this.generateRandomSlots();
  }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError('Không thể lấy danh sách phòng ban.', error);
        this.isLoading = false;
      }
    });
  }

  onRegisterForChange(): void {
    this.isRegisterForRelative = this.appointmentForm.value.registerFor === 'relative';
    const relativeFields = ['relativeName', 'relativeCCCD'];
    
    relativeFields.forEach(field => {
      if (this.isRegisterForRelative) {
        this.appointmentForm.get(field)?.setValidators(Validators.required);
        if (field === 'relativeCCCD') {
          this.appointmentForm.get(field)?.setValidators([
            Validators.required,
            Validators.pattern(/^\d{12}$/),
          ]);
        }
      } else {
        this.appointmentForm.get(field)?.clearValidators();
      }
      this.appointmentForm.get(field)?.updateValueAndValidity();
    });
  }

  generateRandomSlots(): void {
    const startTime = 7;
    const endTime = 16;
    const days = 14;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      const slots: string[] = [];
      for (let hour = startTime; hour < endTime; hour++) {
        slots.push(`${hour}:00 - ${hour + 1}:00`);
      }
      
      this.availableSlots[dateString] = slots;
    }
  }

  getSelectedSlots(): string[] {
    const selectedDate = this.appointmentForm.value.date;
    if (!selectedDate) return [];
    
    const dateString = new Date(selectedDate).toISOString().split('T')[0];
    return this.availableSlots[dateString] || [];
  }

  onDateSelect(date: Date): void {
    this.appointmentForm.patchValue({ date });
  }

  selectTime(time: string): void {
    this.appointmentForm.get('time')?.setValue(time);
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      this.isLoading = true;
      const formData = this.appointmentForm.value;
      
      // Kiểm tra dữ liệu trước khi gửi
      console.log('Form data:', formData);
      
      // Xử lý thời gian
      const selectedDate = new Date(formData.date);
      const timeParts = formData.time.split(' - ')[0].split(':');
      selectedDate.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0, 0);
      
      // Tạo đối tượng yêu cầu đúng định dạng
      const appointmentData: AppointmentRequest = {
        department: {
          departmentId: parseInt(formData.departmentId)
        },
        appointmentDate: selectedDate.toISOString(),
        reason: formData.reason,
        relativeName: formData.registerFor === 'relative' ? formData.relativeName : null,
        relativeIdCard: formData.registerFor === 'relative' ? formData.relativeCCCD : null,
        status: 'PENDING'
      };
      
      console.log('Appointment data:', appointmentData);
      
      // Kiểm tra token trước khi gửi request
      const token = localStorage.getItem('token');
      if (!token) {
        this.handleError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', null);
        this.isLoading = false;
        this.router.navigate(['/login']);
        return;
      }
      
      this.appointmentService.createAppointment(appointmentData, formData.registerFor === 'self').subscribe({
        next: (response: Appointment) => {
          console.log('Response:', response);
          this.showPopup = true;
          this.errorMessage = 'Đăng ký lịch khám thành công!';
          this.resetForm();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error details:', error);
          this.handleError('Không thể đăng ký lịch khám.', error);
          this.isLoading = false;
          
          // Nếu lỗi 401 (Unauthorized), chuyển hướng đến trang đăng nhập
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
    } else {
      // Đánh dấu tất cả các trường là đã chạm vào để hiển thị lỗi
      Object.keys(this.appointmentForm.controls).forEach(key => {
        const control = this.appointmentForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  resetForm(): void {
    this.appointmentForm.reset({
      registerFor: 'self'
    });
    this.isRegisterForRelative = false;
  }

  handleError(message: string, error: any): void {
    console.error(message, error);
    this.showPopup = true;
    
    // Hiển thị thông báo lỗi chi tiết
    if (error && error.message) {
      this.errorMessage = error.message;
    } else if (error && error.error && error.error.message) {
      this.errorMessage = `${message} ${error.error.message}`;
    } else if (error && error.error && typeof error.error === 'string') {
      this.errorMessage = `${message} ${error.error}`;
    } else {
      this.errorMessage = message;
    }
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  getMaxDate(): string {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);
    return maxDate.toISOString().split('T')[0];
  }
}