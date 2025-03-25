import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MedicalRecordService, MedicalRecordDTO } from '../../services/medical-record.service';

@Component({
  selector: 'app-medical-records',
  templateUrl: './medical-records.component.html',
  styleUrls: ['./medical-records.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MedicalRecordsComponent implements OnInit {
  medicalRecords: MedicalRecordDTO[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private medicalRecordService: MedicalRecordService) { }

  ngOnInit(): void {
    this.loadMedicalRecords();
  }

  loadMedicalRecords(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.medicalRecordService.getMedicalRecords().subscribe({
      next: (records) => {
        this.medicalRecords = records;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Có lỗi xảy ra khi tải danh sách hồ sơ bệnh án';
        this.isLoading = false;
      }
    });
  }
} 