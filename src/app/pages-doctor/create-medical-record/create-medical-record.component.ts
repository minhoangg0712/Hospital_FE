import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicalRecordService, MedicalRecordDTO } from '../../services/medical-record.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-medical-record',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-medical-record.component.html',
  styleUrls: ['./create-medical-record.component.css']
})
export class CreateMedicalRecordComponent implements OnInit {
  recordForm: FormGroup;
  patientId!: number;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private medicalRecordService: MedicalRecordService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.recordForm = this.fb.group({
      patientName: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      insuranceNumber: ['', Validators.required],
      symptoms: ['', Validators.required],
      medicalHistory: ['', Validators.required],
      allergies: [''],
      diagnosis: ['', Validators.required],
      testResults: [''],
      prescription: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    this.patientId = Number(this.route.snapshot.queryParamMap.get('patientId'));
    if (!this.patientId) {
      this.errorMessage = 'Không tìm thấy thông tin bệnh nhân';
    }
  }

  onSubmit() {
    if (this.recordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const recordData: MedicalRecordDTO = this.recordForm.value;

      this.medicalRecordService.createMedicalRecord(this.patientId, recordData)
        .subscribe({
          next: (response) => {
            console.log('Tạo hồ sơ thành công:', response);
            this.router.navigate(['/medical-records']);
          },
          error: (error) => {
            console.error('Lỗi khi tạo hồ sơ:', error);
            this.errorMessage = 'Có lỗi xảy ra khi tạo hồ sơ bệnh án';
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    }
  }
} 