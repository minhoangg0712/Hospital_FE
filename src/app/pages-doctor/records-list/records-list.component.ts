import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-records-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './records-list.component.html',
  styleUrls: ['./records-list.component.css']
})
export class RecordsListComponent {
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

 


  // Reset form về trạng thái ban đầu
  resetForm() {
    this.newRecord = this.getEmptyRecord();
  }
}
