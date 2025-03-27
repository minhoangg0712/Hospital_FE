import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MedicalRecordService, MedicalRecordDTO } from '../../services/medical-record.service';

@Component({
  selector: 'app-patient-medical-records',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './patient-medical-records.component.html',
  styleUrls: ['./patient-medical-records.component.css']
})
export class PatientMedicalRecordsComponent implements OnInit {
  medicalRecords: MedicalRecordDTO[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  currentUserId: number | null = null;

  constructor(private medicalRecordService: MedicalRecordService) {}

  ngOnInit() {
    this.getCurrentUserId();
  }

  private getCurrentUserId() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUserId = payload.userId;
        if (this.currentUserId) {
          this.loadMedicalRecords();
        } else {
          this.errorMessage = 'Không tìm thấy thông tin người dùng';
        }
      } catch (error) {
        console.error('Lỗi khi xử lý token:', error);
        this.errorMessage = 'Phiên đăng nhập không hợp lệ';
      }
    } else {
      this.errorMessage = 'Vui lòng đăng nhập để xem hồ sơ bệnh án';
    }
  }

  private loadMedicalRecords() {
    if (!this.currentUserId) {
      this.errorMessage = 'Không tìm thấy thông tin người dùng';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.medicalRecordService.getMedicalRecordsByPatientId(this.currentUserId)
      .subscribe({
        next: (records) => {
          this.medicalRecords = records;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Lỗi khi tải danh sách hồ sơ:', error);
          if (error.status === 403) {
            this.errorMessage = 'Bạn không có quyền truy cập hồ sơ bệnh án';
          } else if (error.status === 401) {
            this.errorMessage = 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại';
          } else {
            this.errorMessage = 'Có lỗi xảy ra khi tải danh sách hồ sơ bệnh án';
          }
          this.isLoading = false;
        }
      });
  }

  get filteredRecords(): MedicalRecordDTO[] {
    if (!this.searchTerm) return this.medicalRecords;
    
    const searchLower = this.searchTerm.toLowerCase();
    return this.medicalRecords.filter(record => 
      record.diagnosis.toLowerCase().includes(searchLower) ||
      record.prescription.toLowerCase().includes(searchLower)
    );
  }
} 