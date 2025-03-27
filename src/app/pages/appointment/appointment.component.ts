import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
})
export class AppointmentComponent implements OnInit {
  appointmentForm: FormGroup;
  isRegisterForRelative = false;
  departments: Department[] = [];
  availableSlots: Record<string, string[]> = {};

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

    // Lấy danh sách phòng ban
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        console.log('Danh sách phòng ban:', this.departments);
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách phòng ban:', error);
        alert('Không thể lấy danh sách phòng ban. Vui lòng thử lại sau.');
      }
    });
  }

  onRegisterForChange(): void {
    this.isRegisterForRelative = this.appointmentForm.value.registerFor === 'relative';

    if (this.isRegisterForRelative) {
      this.appointmentForm.get('relativeName')?.setValidators(Validators.required);
      this.appointmentForm.get('relativeCCCD')?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{12}$/),
      ]);
    } else {
      this.appointmentForm.get('relativeName')?.clearValidators();
      this.appointmentForm.get('relativeCCCD')?.clearValidators();
    }

    this.appointmentForm.get('relativeName')?.updateValueAndValidity();
    this.appointmentForm.get('relativeCCCD')?.updateValueAndValidity();
  }

  generateRandomSlots(): void {
    const startTime = 7;  // Bắt đầu từ 7h sáng
    const endTime = 16;   // Kết thúc lúc 16h40
    const days = 14;      // Tạo lịch cho 14 ngày tới

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];

      const slots: string[] = [];
      for (let hour = startTime; hour < endTime; hour++) {
        slots.push(`${hour}:00 - ${hour + 1}:00`);
      }
      
      slots.push("16:00 - 16:40"); // Slot cuối cùng từ 16:00 đến 16:40

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
      const formData = this.appointmentForm.value;
      const selectedDate = new Date(formData.date);
      const [hours, minutes] = formData.time.split(':');
      selectedDate.setHours(parseInt(hours), parseInt(minutes));

      const appointmentData: AppointmentRequest = {
        department: {
          departmentId: formData.departmentId
        },
        appointmentDate: selectedDate.toISOString(),
        reason: formData.reason,
        status: "Scheduled",
        relativeName: formData.registerFor === 'relative' ? formData.relativeName : null,
        relativeIdCard: formData.registerFor === 'relative' ? formData.relativeCCCD : null
      };

      console.log('Dữ liệu gửi đi:', appointmentData);
      console.log('Token:', localStorage.getItem('token'));

      this.appointmentService.createAppointment(appointmentData, true).subscribe({
        next: (response: Appointment) => {
          console.log('Đặt lịch hẹn thành công:', response);
          alert('Đăng ký lịch khám thành công!');
          this.resetForm();
        },
        error: (error) => {
          console.error('Lỗi khi đăng ký lịch khám:', error);
          if (error.status === 403) {
            if (error.error && error.error.message) {
              alert(error.error.message);
            } else {
              alert('Bạn không có quyền thực hiện chức năng này');
            }
          } else {
            alert('Có lỗi xảy ra khi đăng ký lịch khám. Vui lòng thử lại sau.');
          }
        }
      });
    } else {
      console.error('Form không hợp lệ:', this.appointmentForm.value);
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }

  resetForm(): void {
    this.appointmentForm.reset({
      registerFor: 'self',
    });
    this.isRegisterForRelative = false;
  }
}