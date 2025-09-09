// ast-doctor-schedule.component.ts - Updated for standalone components
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  department: string;
  workingHours: string;
  workingDays: string;
  status: string;
  avatar?: string;
}

@Component({
  selector: 'app-ast-doctor-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ast-doctor-schedule.component.html',
  styleUrls: ['./ast-doctor-schedule.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AstDoctorListComponent implements OnInit {
  searchTerm: string = '';
  isLoading: boolean = false;
  
  doctors: Doctor[] = [
    {
      id: 1,
      name: 'BS. Nguyễn Văn Hùng',
      specialty: 'Tim mạch',
      department: 'Khoa Tim mạch',
      workingHours: '8:00 - 17:00',
      workingDays: 'Thứ 2 - Thứ 6',
      status: 'Đang trực',
      avatar: 'assets/images/doctor-1.jpg'
    },
    {
      id: 2,
      name: 'BS. Trần Thị Lan',
      specialty: 'Nhi khoa',
      department: 'Khoa Nhi',
      workingHours: '7:30 - 16:30',
      workingDays: 'Thứ 2 - Thứ 7',
      status: 'Đang trực',
      avatar: 'assets/images/doctor-2.jpg'
    },
    {
      id: 3,
      name: 'BS. Lê Minh Tuấn',
      specialty: 'Ngoại khoa',
      department: 'Khoa Ngoại tổng hợp',
      workingHours: '6:00 - 14:00',
      workingDays: 'Thứ 3 - Chủ nhật',
      status: 'Nghỉ phép',
      avatar: 'assets/images/doctor-3.jpg'
    },
    {
      id: 4,
      name: 'BS. Phạm Thị Hoa',
      specialty: 'Sản phụ khoa',
      department: 'Khoa Sản',
      workingHours: '8:00 - 17:00',
      workingDays: 'Thứ 2 - Thứ 6',
      status: 'Đang trực',
      avatar: 'assets/images/doctor-4.jpg'
    },
    {
      id: 5,
      name: 'BS. Hoàng Văn Nam',
      specialty: 'Thần kinh',
      department: 'Khoa Thần kinh',
      workingHours: '9:00 - 18:00',
      workingDays: 'Thứ 2 - Thứ 7',
      status: 'Đang phẫu thuật',
      avatar: 'assets/images/doctor-5.jpg'
    },
    {
      id: 6,
      name: 'BS. Vũ Thị Kim',
      specialty: 'Da liễu',
      department: 'Khoa Da liễu',
      workingHours: '8:30 - 17:30',
      workingDays: 'Thứ 2 - Thứ 6',
      status: 'Đang trực',
      avatar: 'assets/images/doctor-6.jpg'
    },
    {
      id: 7,
      name: 'BS. Đỗ Minh Đức',
      specialty: 'Chấn thương chỉnh hình',
      department: 'Khoa Chấn thương chỉnh hình',
      workingHours: '7:00 - 15:00',
      workingDays: 'Thứ 3 - Chủ nhật',
      status: 'Đang trực',
      avatar: 'assets/images/doctor-7.jpg'
    },
    {
      id: 8,
      name: 'BS. Ngô Thị Bích',
      specialty: 'Mắt',
      department: 'Khoa Mắt',
      workingHours: '8:00 - 16:00',
      workingDays: 'Thứ 2 - Thứ 6',
      status: 'Nghỉ phép',
      avatar: 'assets/images/doctor-8.jpg'
    }
  ];
  
  filteredDoctors: Doctor[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.filteredDoctors = this.doctors;
    this.loadDoctorSchedules();
  }

  loadDoctorSchedules(): void {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  searchDoctors(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDoctors = this.doctors;
      return;
    }
    
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredDoctors = this.doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(searchTermLower) ||
      doctor.specialty.toLowerCase().includes(searchTermLower) ||
      doctor.department.toLowerCase().includes(searchTermLower)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredDoctors = this.doctors;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Đang trực': return 'status-active';
      case 'Đang phẫu thuật': return 'status-surgery';
      case 'Nghỉ phép': return 'status-leave';
      default: return 'status-inactive';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Đang trực': return 'fas fa-check-circle';
      case 'Đang phẫu thuật': return 'fas fa-user-md';
      case 'Nghỉ phép': return 'fas fa-calendar-times';
      default: return 'fas fa-question-circle';
    }
  }

  refreshData(): void {
    this.loadDoctorSchedules();
  }

  viewDoctorDetail(doctor: Doctor): void {
    console.log('View doctor detail:', doctor);
  }

  getActiveDoctorsCount(): number {
    return this.doctors.filter(d => d.status === 'Đang trực').length;
  }

  getSurgeryDoctorsCount(): number {
    return this.doctors.filter(d => d.status === 'Đang phẫu thuật').length;
  }

  getLeaveDoctorsCount(): number {
    return this.doctors.filter(d => d.status === 'Nghỉ phép').length;
  }

  trackByDoctorId(index: number, doctor: Doctor): number {
    return doctor.id;
  }

  navigateToHome(): void {
    this.router.navigate(['/assistant']);
  }

  navigateToAppointments(): void {
    this.router.navigate(['/assistant/patient-appointments']);
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}