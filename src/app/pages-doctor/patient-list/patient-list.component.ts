import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { UserService, UserDTO } from '../../services/user.service';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  patients: UserDTO[] = [];
  currentDoctor: UserDTO | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  searchTerm: string = '';

  constructor(
    private patientService: PatientService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDoctorProfile();
  }

  loadDoctorProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Log token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('Token payload:', payload);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }

    this.userService.getCurrentUserProfile().subscribe({
      next: (doctor: UserDTO) => {
        console.log('Doctor profile:', doctor);
        this.currentDoctor = doctor;
        if (doctor.departmentId) {
          this.loadPatientsByDepartment(doctor.departmentId);
        } else {
          this.errorMessage = 'Không tìm thấy thông tin khoa của bác sĩ';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Lỗi khi tải thông tin bác sĩ:', error);
        if (error.status === 401) {
          this.errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.errorMessage = 'Bạn không có quyền truy cập thông tin này.';
        } else {
          this.errorMessage = 'Không thể tải thông tin bác sĩ';
        }
        this.isLoading = false;
      }
    });
  }

  loadPatientsByDepartment(departmentId: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    console.log('Loading patients for department:', departmentId);
    
    this.patientService.getPatientsByDepartment(departmentId).subscribe({
      next: (patients) => {
        console.log('Received patients:', patients);
        this.patients = patients;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải danh sách bệnh nhân:', error);
        if (error.status === 401) {
          this.errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.errorMessage = 'Bạn không có quyền xem danh sách bệnh nhân.';
        } else {
          this.errorMessage = 'Không thể tải danh sách bệnh nhân';
        }
        this.isLoading = false;
      }
    });
  }

  viewMedicalRecord(patientId: number): void {
    this.router.navigate(['/doctor/medical-records'], {
      queryParams: {
        patientId: patientId
      }
    });
  }

  get filteredPatients(): UserDTO[] {
    if (!this.searchTerm) return this.patients;
    
    const searchLower = this.searchTerm.toLowerCase();
    return this.patients.filter(patient => 
      patient.name.toLowerCase().includes(searchLower) ||
      patient.cccd.includes(searchLower) ||
      patient.phone.includes(searchLower)
    );
  }
} 