import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MedicalRecordService, CreateMedicalRecordDTO } from '../../services/medical-record.service';
import { UserService, UserDTO } from '../../services/user.service';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { PatientService } from '../../services/patient.service';

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
  appointmentId!: number;
  isLoading = false;
  errorMessage = '';
  patientInfo: UserDTO | null = null;
  showSuccessPopup = false;
  appointment: Appointment | null = null;

  constructor(
    private fb: FormBuilder,
    private medicalRecordService: MedicalRecordService,
    private userService: UserService,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
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
    // Lấy patientId và appointmentId từ query params
    this.patientId = Number(this.route.snapshot.queryParamMap.get('patientId'));
    this.appointmentId = Number(this.route.snapshot.queryParamMap.get('appointmentId'));
    
    if (!this.patientId) {
      this.errorMessage = 'Không tìm thấy thông tin bệnh nhân';
      return;
    }

    // Lấy thông tin chi tiết bệnh nhân
    this.isLoading = true;
    this.patientService.getPatientProfile(this.patientId).subscribe({
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

    // Lấy thông tin cuộc hẹn - chỉ khi có appointmentId
    if (this.appointmentId) {
      this.loadAppointment();
    }
  }

  loadAppointment() {
    // Kiểm tra xem có quyền truy cập không
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'ROLE_MGR') {
      console.warn('Người dùng không có quyền truy cập thông tin cuộc hẹn');
      return;
    }

    this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
      next: (appointment: Appointment) => {
        this.appointment = appointment;
        console.log('Thông tin cuộc hẹn:', appointment);
      },
      error: (error: any) => {
        console.error('Lỗi khi lấy thông tin cuộc hẹn:', error);
        
        // Xử lý lỗi 403
        if (error.status === 403) {
          console.warn('Không có quyền truy cập thông tin cuộc hẹn này');
          // Không hiển thị lỗi cho người dùng, chỉ ghi log
        } else {
          // Các lỗi khác có thể hiển thị cho người dùng
          this.errorMessage = 'Không thể lấy thông tin cuộc hẹn';
        }
      }
    });
  }

  onSubmit() {
    if (this.recordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      // Kiểm tra dữ liệu trước khi gửi
      const symptoms = this.recordForm.get('symptoms')?.value?.trim();
      const medicalHistory = this.recordForm.get('medicalHistory')?.value?.trim();
      const diagnosis = this.recordForm.get('diagnosis')?.value?.trim();
      const prescription = this.recordForm.get('prescription')?.value?.trim();

      if (!symptoms || !medicalHistory || !diagnosis || !prescription) {
        this.errorMessage = 'Vui lòng điền đầy đủ thông tin bắt buộc';
        this.isLoading = false;
        return;
      }

      const recordData: CreateMedicalRecordDTO = {
        symptoms: symptoms,
        medicalHistory: medicalHistory,
        allergies: this.recordForm.get('allergies')?.value?.trim() || '',
        diagnosis: diagnosis,
        testResults: this.recordForm.get('testResults')?.value?.trim() || '',
        prescription: prescription,
        notes: this.recordForm.get('notes')?.value?.trim() || ''
      };

      // Đảm bảo patientName được lưu đúng cách
      if (this.patientInfo) {
        recordData.patientName = this.patientInfo.name;
      } else {
        this.errorMessage = 'Không tìm thấy thông tin bệnh nhân';
        this.isLoading = false;
        return;
      }

      // Không thêm thông tin người thân vào recordData
      // Chỉ sử dụng thông tin của người đặt lịch hẹn

      // Log dữ liệu trước khi gửi để debug
      console.log('Dữ liệu hồ sơ bệnh án:', recordData);
      console.log('PatientId:', this.patientId);

      // Luôn sử dụng createMedicalRecord thay vì createRelativeMedicalRecord
      const createRecord$ = this.medicalRecordService.createMedicalRecord(this.patientId, recordData);

      createRecord$.subscribe({
        next: (response) => {
          console.log('Tạo hồ sơ thành công:', response);
          this.showSuccessPopup = true;
          setTimeout(() => {
            this.router.navigate(['/doctor/schedule']);
          }, 3000);
        },
        error: (error: any) => {
          console.error('Lỗi khi tạo hồ sơ:', error);
          console.error('Chi tiết lỗi:', error.error);
          
          if (error.status === 403) {
            this.errorMessage = 'Bạn không có quyền tạo hồ sơ bệnh án';
          } else if (error.status === 400) {
            // Hiển thị thông báo lỗi chi tiết từ server nếu có
            if (error.error && error.error.message) {
              this.errorMessage = `Lỗi: ${error.error.message}`;
            } else if (error.error && typeof error.error === 'string') {
              this.errorMessage = `Lỗi: ${error.error}`;
            } else {
              this.errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
            }
          } else if (error.status === 401) {
            this.errorMessage = 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại';
          } else {
            this.errorMessage = 'Có lỗi xảy ra khi tạo hồ sơ bệnh án. Vui lòng thử lại sau.';
          }
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      // Hiển thị lỗi cụ thể cho từng trường không hợp lệ
      const invalidFields = [];
      if (this.recordForm.get('symptoms')?.invalid) invalidFields.push('Triệu chứng');
      if (this.recordForm.get('medicalHistory')?.invalid) invalidFields.push('Tiền sử bệnh');
      if (this.recordForm.get('diagnosis')?.invalid) invalidFields.push('Chẩn đoán');
      if (this.recordForm.get('prescription')?.invalid) invalidFields.push('Đơn thuốc');
      
      this.errorMessage = `Vui lòng điền đầy đủ thông tin cho: ${invalidFields.join(', ')}`;
    }
  }
} 