import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, DoctorProfile } from '../../services/admin.service';
import { AdminNavComponent } from '../../component/admin-nav/admin-nav.component';

@Component({
  selector: 'app-admin-doctor-list',
  templateUrl: './admin-doctor-list.component.html',
  styleUrls: ['./admin-doctor-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavComponent]
})
export class AdminDoctorListComponent implements OnInit {
  doctors: DoctorProfile[] = [];
  filteredDoctors: DoctorProfile[] = [];
  departments: string[] = [];
  selectedDepartment: string = '';
  searchText: string = '';
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.loadDoctors();
    this.departments = ['Khoa Nội', 'Khoa Nhi', 'Khoa Tim mạch', 'Khoa Tai Mũi Họng', 'Khoa Răng Hàm Mặt'];
  }

  loadDoctors() {
    this.loading = true;
    this.error = null;
    this.adminService.getDoctorProfiles().subscribe({
      next: (response: DoctorProfile[]) => {
        this.doctors = response;
        this.filteredDoctors = response;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = error.error?.error || 'Có lỗi xảy ra khi tải danh sách bác sĩ';
        this.loading = false;
      }
    });
  }

  filterDoctors() {
    this.filteredDoctors = this.doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesDepartment = !this.selectedDepartment || doctor.departmentId.toString() === this.selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }

  deleteDoctor(doctor: DoctorProfile) {
    if (confirm(`Bạn có chắc chắn muốn xóa bác sĩ ${doctor.name}?`)) {
      this.loading = true;
      this.error = null;
      this.adminService.deleteDoctor(doctor.userId).subscribe({
        next: () => {
          this.doctors = this.doctors.filter(d => d.userId !== doctor.userId);
          this.filterDoctors();
          this.loading = false;
        },
        error: (error: any) => {
          this.error = error.error?.error || 'Có lỗi xảy ra khi xóa bác sĩ';
          this.loading = false;
        }
      });
    }
  }
}