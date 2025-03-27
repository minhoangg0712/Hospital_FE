import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MedicalRecordService, CreateMedicalRecordDTO } from '../../services/medical-record.service';
import { UserService, UserDTO } from '../../services/user.service';

@Component({
  selector: 'app-create-medical-record',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-medical-record.component.html',
  styleUrls: ['./create-medical-record.component.css']
})
export class CreateMedicalRecordComponent implements OnInit {
  recordForm: FormGroup;
  patientId!: number;
  isLoading = false;
  errorMessage = '';
  patientInfo: UserDTO | null = null;

  constructor(
    private fb: FormBuilder,
    private medicalRecordService: MedicalRecordService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.recordForm = this.fb.group({
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
    // Lấy patientId từ query params
    this.patientId = Number(this.route.snapshot.queryParamMap.get('patientId'));
    
    if (!this.patientId) {
      this.errorMessage = 'Không tìm thấy thông tin bệnh nhân';
      return;
    }

    // Lấy thông tin chi tiết bệnh nhân
    this.isLoading = true;
    this.userService.getUserById(this.patientId).subscribe({
      next: (user: UserDTO) => {
        this.patientInfo = user;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Lỗi khi lấy thông tin bệnh nhân:', error);
        this.errorMessage = 'Không thể lấy thông tin bệnh nhân';
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.recordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const recordData: CreateMedicalRecordDTO = {
        symptoms: this.recordForm.get('symptoms')?.value,
        medicalHistory: this.recordForm.get('medicalHistory')?.value,
        allergies: this.recordForm.get('allergies')?.value,
        diagnosis: this.recordForm.get('diagnosis')?.value,
        testResults: this.recordForm.get('testResults')?.value,
        prescription: this.recordForm.get('prescription')?.value,
        notes: this.recordForm.get('notes')?.value
      };

      this.medicalRecordService.createMedicalRecord(this.patientId, recordData)
        .subscribe({
          next: (response) => {
            console.log('Tạo hồ sơ thành công:', response);
            alert('Tạo hồ sơ bệnh án thành công!');
            this.router.navigate(['/patient-list']);
          },
          error: (error) => {
            console.error('Lỗi khi tạo hồ sơ:', error);
            if (error.status === 403) {
              this.errorMessage = 'Bạn không có quyền tạo hồ sơ bệnh án';
            } else if (error.status === 400) {
              this.errorMessage = error.error?.message || 'Dữ liệu không hợp lệ';
            } else {
              this.errorMessage = 'Có lỗi xảy ra khi tạo hồ sơ bệnh án';
            }
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    } else {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin bắt buộc';
    }
  }
} 