import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medical-records',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medical-records.component.html',
  styleUrls: ['./medical-records.component.css']
})
export class MedicalRecordsComponent {
  records = [
    {
      patientName: 'Nguyễn Văn A',
      gender: 'Nam',
      dateOfBirth: '1990-05-15',
      address: 'Hà Nội, Việt Nam',
      phone: '0123456789',
      email: 'nguyenvana@example.com',
      weight: 65,
      height: 170,
      symptoms: 'Sốt, ho, đau họng',
      medicalHistory: 'Tiểu đường',
      healthInsuranceId: 'BHYT123456',
      allergies: 'Không',
      diagnose: 'Cảm cúm',
      result: 'Không có gì đặc biệt'
    }
  ];

  newRecord = this.getEmptyRecord();
  editIndex: number | null = null;

  // Hàm khởi tạo một hồ sơ bệnh án rỗng
  getEmptyRecord() {
    return {
      patientName: '',
      gender: 'Nam',
      dateOfBirth: '',
      address: '',
      phone: '',
      email: '',
      weight: 0,
      height: 0,
      symptoms: '',
      medicalHistory: '',
      healthInsuranceId: '',
      allergies: '',
      diagnose: '',
      result: ''
    };
  }

  // Thêm mới hoặc cập nhật hồ sơ bệnh án
  saveRecord() {
    if (!this.newRecord.patientName || !this.newRecord.dateOfBirth || !this.newRecord.address) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (this.editIndex === null) {
      this.records.push({ ...this.newRecord });
    } else {
      this.records[this.editIndex] = { ...this.newRecord };
      this.editIndex = null;
    }

    this.resetForm();
  }

  // Chỉnh sửa hồ sơ bệnh án
  editRecord(index: number) {
    this.newRecord = { ...this.records[index] };
    this.editIndex = index;
  }

  // Xóa hồ sơ bệnh án
  deleteRecord(index: number) {
    if (confirm('Bạn có chắc chắn muốn xóa hồ sơ này không?')) {
      this.records.splice(index, 1);
      if (this.editIndex === index) {
        this.cancelEdit();
      }
    }
  }

  // Hủy chỉnh sửa
  cancelEdit() {
    this.editIndex = null;
    this.resetForm();
  }

  // Reset form về trạng thái ban đầu
  resetForm() {
    this.newRecord = this.getEmptyRecord();
  }
}
