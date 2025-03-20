import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-create-doctor',
  templateUrl: './admin-create-doctor.component.html',
  styleUrls: ['./admin-create-doctor.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AdminCreateDoctorComponent {
  doctorForm: FormGroup;
  departments: string[] = [
    'Nội tổng quát', 'Ngoại tổng quát', 'Nhi khoa', 'Sản phụ khoa', 'Tim mạch',
    'Tai mũi họng', 'Da liễu', 'Mắt (Nhãn khoa)', 'Thần kinh', 'Cơ xương khớp',
    'Tiết niệu', 'Ung bướu', 'Nội tiết', 'Chấn thương chỉnh hình', 'Phục hồi chức năng',
    'Răng hàm mặt', 'Tâm thần', 'Y học cổ truyền', 'Dinh dưỡng',
  ]; // Danh sách phòng ban

  constructor(private fb: FormBuilder, private router: Router) {
    this.doctorForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      department: ['', Validators.required]
    });
  }

  createDoctor() {
    if (this.doctorForm.valid) {
      const newDoctor = this.doctorForm.value;

      // Lưu danh sách bác sĩ vào LocalStorage
      const doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
      doctors.push(newDoctor);
      localStorage.setItem('doctors', JSON.stringify(doctors));

      alert('Tài khoản bác sĩ đã được tạo thành công!');
      this.router.navigateByUrl('/admin-doctor-list'); // Điều hướng sang trang danh sách bác sĩ
    } else {
      alert('Vui lòng nhập đầy đủ thông tin!');
    }
  }
}