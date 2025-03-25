import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MedicalRecordService, MedicalRecordDTO } from '../../services/medical-record.service';

@Component({
  selector: 'app-medical-record-detail',
  templateUrl: './medical-record-detail.component.html',
  styleUrls: ['./medical-record-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MedicalRecordDetailComponent implements OnInit {
  medicalRecord: MedicalRecordDTO | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private medicalRecordService: MedicalRecordService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const recordId = this.route.snapshot.paramMap.get('id');
    if (recordId) {
      this.loadMedicalRecord(Number(recordId));
    }
  }

  loadMedicalRecord(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.medicalRecordService.getMedicalRecordById(id).subscribe({
      next: (record) => {
        this.medicalRecord = record;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Có lỗi xảy ra khi tải thông tin hồ sơ bệnh án';
        this.isLoading = false;
      }
    });
  }
} 