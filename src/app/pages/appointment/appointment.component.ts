import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule} from '@angular/router';

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
    RouterModule
  ],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
})
export class AppointmentComponent {
  appointmentForm: FormGroup;
  isRegisterForRelative = false; // Kiểm tra nếu chọn "Người thân"

  // Danh sách chuyên khoa
  specialties = [
    'Nội tổng quát',
    'Ngoại tổng quát',
    'Nhi khoa',
    'Sản phụ khoa',
    'Tim mạch',
    'Tai mũi họng',
    'Da liễu',
    'Mắt (Nhãn khoa)',
    'Thần kinh',
    'Cơ xương khớp',
    'Tiết niệu',
    'Ung bướu',
    'Nội tiết',
    'Chấn thương chỉnh hình',
    'Phục hồi chức năng',
    'Răng hàm mặt',
    'Tâm thần',
    'Y học cổ truyền',
    'Dinh dưỡng',
  ];

  // Lịch trống cho từng ngày
  availableSlots: Record<string, string[]> = {};

  constructor(private fb: FormBuilder) {
    this.appointmentForm = this.fb.group({
      registerFor: ['self', Validators.required], // Chọn "Bản thân" hoặc "Người thân"
      relativeName: [''],                         // Tên người thân (ẩn mặc định)
      relativeCCCD: [''],                         // CCCD (ẩn mặc định)
      specialty: ['', Validators.required],       // Chuyên khoa
      date: ['', Validators.required],            // Ngày khám
      time: ['', Validators.required],            // Giờ khám
      reason: ['', [Validators.required, Validators.minLength(2)]], // Lý do khám
    });
  

    this.generateRandomSlots(); // Tạo giờ khám ngẫu nhiên
  }

  /** ✅ Xử lý thay đổi khi chọn "Đăng ký cho ai" */
  onRegisterForChange(): void {
    this.isRegisterForRelative = this.appointmentForm.value.registerFor === 'relative';

    // Cập nhật validation cho "Tên người thân" và "CCCD"
    if (this.isRegisterForRelative) {
      this.appointmentForm.get('relativeName')?.setValidators(Validators.required);
      this.appointmentForm.get('relativeCCCD')?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{12}$/), // 12 số CCCD
      ]);
    } else {
      this.appointmentForm.get('relativeName')?.clearValidators();
      this.appointmentForm.get('relativeCCCD')?.clearValidators();
    }

    this.appointmentForm.get('relativeName')?.updateValueAndValidity();
    this.appointmentForm.get('relativeCCCD')?.updateValueAndValidity();
  }

  /** ✅ Tạo giờ khám (8:00 - 16:30) cho 14 ngày tới */
  generateRandomSlots(): void {
    const startTime = 8; // Bắt đầu từ 8:00 AM
    const endTime = 17; // Kết thúc lúc 5:00 PM
    const days = 14; // 14 ngày tới

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];

      const slots: string[] = [];
      for (let hour = startTime; hour < endTime; hour++) {
        slots.push(`${hour}:00`, `${hour}:30`);
      }

      this.availableSlots[dateString] = slots;
    }
  }

  /** ✅ Lấy giờ khám theo ngày */
  getSelectedSlots(): string[] {
    const selectedDate = this.appointmentForm.value.date;
    if (!selectedDate) return [];

    const dateString = new Date(selectedDate).toISOString().split('T')[0];
    return this.availableSlots[dateString] || [];
  }

  /** ✅ Cập nhật ngày khi chọn từ mat-calendar */
  onDateSelect(date: Date): void {
    this.appointmentForm.patchValue({ date });
  }

  /** ✅ Chọn giờ khám */
  selectTime(time: string): void {
    this.appointmentForm.get('time')?.setValue(time);
  }

  /** ✅ Gửi thông tin đặt lịch */
  onSubmit(): void {
    if (this.appointmentForm.valid) {
      console.log('Dữ liệu lịch khám:', this.appointmentForm.value);
      alert('Đăng ký lịch khám thành công!');
      this.resetForm();
    } else {
      console.error('Form không hợp lệ:', this.appointmentForm.value);
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }

  /** ✅ Đặt lại form sau khi đăng ký */
  resetForm(): void {
    this.appointmentForm.reset({
      registerFor: 'self',
    });
    this.isRegisterForRelative = false;
  }
}