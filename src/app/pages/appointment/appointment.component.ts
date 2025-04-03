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
  showPopup: boolean = false;
  errorMessage: string = '';

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
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => this.departments = departments,
      error: (error) => this.handleError('Không thể lấy danh sách phòng ban.', error)
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
      
      const slots = Array.from({ length: endTime - startTime }, (_, k) => `${k + startTime}:00 - ${k + startTime + 1}:00`);
      slots.push("16:00 - 16:40");
      
      this.availableSlots[dateString] = slots;
    }
  }

  getSelectedSlots(): string[] {
    const selectedDate = this.appointmentForm.value.date;
    return selectedDate ? this.availableSlots[new Date(selectedDate).toISOString().split('T')[0]] || [] : [];
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
        department: { departmentId: formData.departmentId },
        appointmentDate: selectedDate.toISOString(),
        reason: formData.reason,
        status: "Scheduled",
        relativeName: formData.registerFor === 'relative' ? formData.relativeName : null,
        relativeIdCard: formData.registerFor === 'relative' ? formData.relativeCCCD : null
      };

      const forSelf = formData.registerFor === 'self';
      this.appointmentService.createAppointment(appointmentData, forSelf).subscribe({
        next: () => {
          alert('Đăng ký lịch khám thành công!');
          this.resetForm();
        },
        error: (error) => this.handleSubmitError(error)
      });
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }

  handleError(message: string, error: any): void {
    console.error(message, error);
    alert(message);
  }

  handleSubmitError(error: any): void {
    console.error('Lỗi khi đăng ký lịch khám:', error);
    
    if (error.status === 400) {
      this.errorMessage = error.error?.message || 'Đã có người đặt thời gian này. Vui lòng chọn thời gian khác.';
      this.showPopup = true; // Hiển thị popup
    } else if (error.status === 403) {
      this.errorMessage = 'Bạn không có quyền thực hiện chức năng này.';
      this.showPopup = true;
    } else {
      this.errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      this.showPopup = true;
    }
  }  

  resetForm(): void {
    this.appointmentForm.reset({ registerFor: 'self' });
    this.isRegisterForRelative = false;
  }
}
