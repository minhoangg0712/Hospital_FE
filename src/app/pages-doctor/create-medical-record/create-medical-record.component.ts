import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalRecordService, MedicalRecordDTO } from '../../services/medical-record.service';
import { UserService, UserDTO } from '../../services/user.service';
import { DepartmentService } from '../../services/department.service';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-create-medical-record',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-medical-record.component.html',
  styleUrls: ['./create-medical-record.component.css']
})
export class CreateMedicalRecordComponent implements OnInit {
  medicalRecordForm: FormGroup;
  patients: UserDTO[] = [];
  selectedPatient: UserDTO | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  departmentId = 0;

  constructor(
    private fb: FormBuilder,
    private medicalRecordService: MedicalRecordService,
    private userService: UserService,
    private departmentService: DepartmentService,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.medicalRecordForm = this.fb.group({
      patientId: ['', Validators.required],
      patientName: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      insuranceNumber: ['', Validators.required],
      symptoms: ['', Validators.required],
      medicalHistory: [''],
      allergies: [''],
      diagnosis: ['', Validators.required],
      testResults: [''],
      prescription: ['', Validators.required],
      notes: ['']
    });

    // Lắng nghe sự kiện thay đổi của patientId
    this.medicalRecordForm.get('patientId')?.valueChanges.subscribe(value => {
      if (value) {
        this.onPatientSelect(value);
      }
    });
  }

  ngOnInit(): void {
    // Lấy department_id từ route hoặc service
    const departmentIdParam = this.route.snapshot.paramMap.get('departmentId');
    if (departmentIdParam) {
      this.departmentId = Number(departmentIdParam);
      console.log('Department ID:', this.departmentId);
      this.loadPatientsByDepartment();
    } else {
      // Nếu không có departmentId trong route, lấy từ profile của bác sĩ
      this.userService.getCurrentUserProfile().subscribe({
        next: (doctor) => {
          if (doctor.departmentId) {
            this.departmentId = doctor.departmentId;
            console.log('Department ID from doctor profile:', this.departmentId);
            this.loadPatientsByDepartment();
          } else {
            this.errorMessage = 'Không tìm thấy thông tin khoa của bác sĩ';
          }
        },
        error: (error) => {
          console.error('Lỗi khi lấy thông tin bác sĩ:', error);
          this.errorMessage = 'Không thể lấy thông tin bác sĩ';
        }
      });
    }
  }

  loadPatientsByDepartment(): void {
    this.isLoading = true;
    console.log('Đang tải danh sách bệnh nhân cho department:', this.departmentId);
    this.patientService.getPatientsByDepartment(this.departmentId).subscribe({
      next: (patients: UserDTO[]) => {
        console.log('Danh sách bệnh nhân:', patients);
        this.patients = patients;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải danh sách bệnh nhân:', error);
        this.errorMessage = 'Không thể tải danh sách bệnh nhân';
        this.isLoading = false;
      }
    });
  }

  onPatientSelect(patientId: number): void {
    console.log('Đã chọn bệnh nhân:', patientId);
    console.log('Danh sách bệnh nhân hiện tại:', this.patients);
    
    const patient = this.patients.find(p => p.userId === patientId);
    if (patient) {
      console.log('Thông tin bệnh nhân:', patient);
      this.selectedPatient = patient;
      
      // Điền thông tin vào form
      this.medicalRecordForm.patchValue({
        patientName: patient.name,
        gender: patient.gender,
        address: patient.address || '',
        insuranceNumber: patient.insuranceNumber || '',
        symptoms: '',
        medicalHistory: '',
        allergies: '',
        diagnosis: '',
        testResults: '',
        prescription: '',
        notes: ''
      });
    } else {
      console.log('Không tìm thấy bệnh nhân với ID:', patientId);
    }
  }

  onSubmit(): void {
    if (this.medicalRecordForm.valid && this.selectedPatient) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const record: MedicalRecordDTO = {
        patientName: this.medicalRecordForm.value.patientName,
        gender: this.medicalRecordForm.value.gender,
        address: this.medicalRecordForm.value.address,
        insuranceNumber: this.medicalRecordForm.value.insuranceNumber,
        symptoms: this.medicalRecordForm.value.symptoms,
        medicalHistory: this.medicalRecordForm.value.medicalHistory,
        allergies: this.medicalRecordForm.value.allergies,
        diagnosis: this.medicalRecordForm.value.diagnosis,
        testResults: this.medicalRecordForm.value.testResults,
        prescription: this.medicalRecordForm.value.prescription,
        notes: this.medicalRecordForm.value.notes
      };

      console.log('Dữ liệu gửi đi:', record);

      this.medicalRecordService.createMedicalRecord(this.selectedPatient.userId, record).subscribe({
        next: (response) => {
          this.successMessage = 'Tạo hồ sơ khám bệnh thành công!';
          setTimeout(() => {
            this.router.navigate(['/doctor/patient-profile', this.selectedPatient?.userId]);
          }, 2000);
        },
        error: (error) => {
          console.error('Lỗi khi tạo hồ sơ:', error);
          this.errorMessage = error.error?.message || 'Không thể tạo hồ sơ khám bệnh';
          this.isLoading = false;
        }
      });
    }
  }

  cancel(): void {
    if (this.departmentId) {
      this.router.navigate(['/doctor/department', this.departmentId]);
    }
  }
} 