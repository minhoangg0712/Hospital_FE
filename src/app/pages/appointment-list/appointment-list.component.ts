import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { DepartmentService, Department } from '../../services/department.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    RouterModule,
    MatTooltipModule
  ],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  departments: Department[] = [];
  displayedColumns: string[] = ['id', 'department', 'date', 'reason', 'status', 'actions'];

  constructor(
    private appointmentService: AppointmentService,
    private departmentService: DepartmentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadAppointments();
    this.loadDepartments();
  }

  loadAppointments() {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        console.log('Danh sách lịch hẹn:', this.appointments);
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách lịch hẹn:', error);
        alert('Không thể tải danh sách lịch hẹn. Vui lòng thử lại sau.');
      }
    });
  }

  loadDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        console.log('Danh sách phòng ban:', this.departments);
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách phòng ban:', error);
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

  openEditDialog(appointment: Appointment) {
    // TODO: Implement edit dialog
    console.log('Edit appointment:', appointment);
  }

  deleteAppointment(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) {
      this.appointmentService.deleteAppointment(id).subscribe({
        next: () => {
          alert('Xóa lịch hẹn thành công!');
          this.loadAppointments();
        },
        error: (error) => {
          console.error('Lỗi khi xóa lịch hẹn:', error);
          alert('Không thể xóa lịch hẹn. Vui lòng thử lại sau.');
        }
      });
    }
  }
} 