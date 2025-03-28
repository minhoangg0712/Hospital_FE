import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { DepartmentService, Department } from '../../services/department.service';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-appointment-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './appointment-history.component.html',
  styleUrls: ['./appointment-history.component.css']
})
export class AppointmentHistoryComponent implements OnInit {
  appointments: Appointment[] = [];
  departments: Department[] = [];
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private departmentService: DepartmentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.loadDepartments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.error = '';
    
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.error = 'Không tìm thấy thông tin người dùng';
      this.isLoading = false;
      return;
    }

    this.appointmentService.getPatientAppointments().subscribe({
      next: (data: Appointment[]) => {
        this.appointments = data;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Lỗi khi lấy danh sách lịch hẹn:', error);
        this.error = 'Không thể tải danh sách lịch hẹn. Vui lòng thử lại sau.';
        this.isLoading = false;
      }
    });
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Lỗi khi lấy danh sách khoa:', error);
      }
    });
  }

  getDepartmentName(departmentId: number): string {
    const department = this.departments.find(d => d.departmentId === departmentId);
    return department ? department.departmentName : 'N/A';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'status-scheduled';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  deleteAppointment(id: number): void {
    if (confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      this.appointmentService.deleteAppointment(id).subscribe({
        next: () => {
          alert('Hủy lịch hẹn thành công');
          this.loadAppointments();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Lỗi khi hủy lịch hẹn:', error);
          alert('Có lỗi xảy ra khi hủy lịch hẹn. Vui lòng thử lại sau.');
        }
      });
    }
  }
} 