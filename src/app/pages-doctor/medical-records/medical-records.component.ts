import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MedicalRecordService, MedicalRecordDTO } from '../../services/medical-record.service';

@Component({
  selector: 'app-medical-records',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './medical-records.component.html',
  styleUrls: ['./medical-records.component.css']
})
export class MedicalRecordsComponent implements OnInit {
  medicalRecords: MedicalRecordDTO[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';

  constructor(private medicalRecordService: MedicalRecordService) {}

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
        console.error('Lỗi khi tải danh sách hồ sơ:', error);
        this.errorMessage = 'Có lỗi xảy ra khi tải danh sách hồ sơ bệnh án';
        this.isLoading = false;
      }
    });
  }

  get filteredRecords(): MedicalRecordDTO[] {
    if (!this.searchTerm) return this.medicalRecords;
    
    const searchLower = this.searchTerm.toLowerCase();
    return this.medicalRecords.filter(record => 
      record.patientName.toLowerCase().includes(searchLower) ||
      record.insuranceNumber.toLowerCase().includes(searchLower) ||
      record.diagnosis.toLowerCase().includes(searchLower)
    );
  }
} 