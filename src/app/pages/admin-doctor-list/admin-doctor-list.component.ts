import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-admin-doctor-list',
  templateUrl: './admin-doctor-list.component.html',
  styleUrls: ['./admin-doctor-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule], 
})
export class AdminDoctorListComponent {
  doctors = [
    { username: 'bacsi01', department: 'Nội tổng quát' },
    { username: 'bacsi02', department: 'Nhi khoa' },
    { username: 'bacsi03', department: 'Tim mạch' },
    { username: 'bacsi04', department: 'Da liễu' },
  ];

  filteredDoctors = [...this.doctors];
  searchText: string = '';
  selectedDepartment: string = '';

  departments: string[] = [
    'Nội tổng quát',
    'Ngoại tổng quát',
    'Nhi khoa',
    'Sản phụ khoa',
    'Tim mạch',
    'Tai mũi họng',
    'Da liễu',
    'Mắt (Nhãn khoa)',
    'Thần kinh',
    'Cơ xương khớp',
    'Tiết niệu',
    'Ung bướu',
    'Nội tiết',
    'Chấn thương chỉnh hình',
    'Phục hồi chức năng',
    'Răng hàm mặt',
    'Tâm thần',
    'Y học cổ truyền',
    'Dinh dưỡng',
  ];

  filterDoctors() {
    this.filteredDoctors = this.doctors.filter((doctor) => {
      const matchesSearch = doctor.username.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesDepartment = this.selectedDepartment ? doctor.department === this.selectedDepartment : true;
      return matchesSearch && matchesDepartment;
    });
  }

  deleteDoctor(doctorToDelete: any) {
    const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa bác sĩ ${doctorToDelete.username}?`);
    if (confirmDelete) {
      this.doctors = this.doctors.filter((doctor) => doctor !== doctorToDelete);
      this.filterDoctors();
    }
  }
}