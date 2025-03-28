import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-doctor-schedule',
  templateUrl: './doctor-schedule.component.html',
  styleUrls: ['./doctor-schedule.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class DoctorScheduleComponent implements OnInit {
  appointments: Appointment[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  dateFilter: string = '';
  isLoading = false;
  errorMessage = '';
  currentUser: any = null;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Lấy thông tin user từ token
    this.currentUser = this.authService.getCurrentUser();
    console.log('Current user from token:', this.currentUser);
    
    if (this.currentUser) {
      this.loadAppointments();
    } else {
      this.errorMessage = 'Không tìm thấy thông tin người dùng';
    }
  }

  loadAppointments() {
    this.isLoading = true;
    this.errorMessage = '';
    
    if (!this.currentUser) {
      this.errorMessage = 'Không tìm thấy thông tin người dùng';
      this.isLoading = false;
      return;
    }

    // Kiểm tra token
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Không tìm thấy token xác thực';
      this.isLoading = false;
      return;
    }

    // Kiểm tra role
    if (this.currentUser.roleCode !== 'ROLE_MGR') {
      this.errorMessage = 'Bạn không có quyền xem danh sách lịch hẹn';
      this.isLoading = false;
      return;
    }

    console.log('Current user role:', this.currentUser.roleCode);
    console.log('Current user department:', this.currentUser.departmentId);
    console.log('Token:', token);
    
    console.log('Đang gọi API getAppointments...');
    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        console.log('Dữ liệu lịch hẹn:', appointments);
        
        // Hiển thị tất cả lịch hẹn nếu không có departmentId
        if (!this.currentUser.departmentId) {
          console.log('Không có departmentId, hiển thị tất cả lịch hẹn');
          this.appointments = appointments;
        } else {
          // Lọc lịch hẹn theo department của bác sĩ
          this.appointments = appointments.filter(appointment => {
            console.log('So sánh department:', {
              appointmentDepartment: appointment.department.departmentId,
              userDepartment: this.currentUser.departmentId
            });
            return appointment.department.departmentId === this.currentUser.departmentId;
          });
        }
        
        console.log('Lịch hẹn sau khi lọc:', this.appointments);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Chi tiết lỗi:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          headers: error.headers,
          url: error.url
        });
        
        if (error.status === 403) {
          this.errorMessage = 'Bạn không có quyền xem danh sách lịch hẹn';
        } else {
          this.errorMessage = 'Có lỗi xảy ra khi tải lịch hẹn';
        }
        this.isLoading = false;
      }
    });
  }

  createMedicalRecord(appointment: Appointment) {
    // Chuyển hướng đến trang tạo hồ sơ khám bệnh với thông tin lịch hẹn
    this.router.navigate(['/create-medical-record'], {
      queryParams: {
        appointmentId: appointment.appointmentId,
        patientId: appointment.user.userId,
        patientName: appointment.user.name
      }
    });
  }

  completeAppointment(appointment: Appointment) {
    if (confirm('Bạn có chắc chắn muốn hoàn thành lịch hẹn này?')) {
      this.appointmentService.updateAppointmentStatus(appointment.appointmentId, 'Completed').subscribe({
        next: () => {
          this.loadAppointments(); // Tải lại danh sách
        },
        error: (error) => {
          console.error('Lỗi khi hoàn thành lịch hẹn:', error);
          this.errorMessage = 'Có lỗi xảy ra khi hoàn thành lịch hẹn';
        }
      });
    }
  }

  cancelAppointment(appointment: Appointment) {
    if (confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      this.appointmentService.updateAppointmentStatus(appointment.appointmentId, 'Cancelled').subscribe({
        next: () => {
          this.loadAppointments(); // Tải lại danh sách
        },
        error: (error) => {
          console.error('Lỗi khi hủy lịch hẹn:', error);
          this.errorMessage = 'Có lỗi xảy ra khi hủy lịch hẹn';
        }
      });
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'Scheduled':
        return 'Chờ khám';
      case 'Completed':
        return 'Đã khám';
      case 'Cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  }

  get filteredAppointments(): Appointment[] {
    return this.appointments.filter(appointment => {
      // Lọc theo tìm kiếm
      const matchesSearch = this.searchTerm ? 
        appointment.user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        appointment.user.phone.includes(this.searchTerm) ||
        appointment.reason.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      // Lọc theo trạng thái
      const matchesStatus = this.statusFilter ? 
        appointment.status === this.statusFilter 
        : true;

      // Lọc theo ngày
      const matchesDate = this.dateFilter ? 
        appointment.appointmentDate.startsWith(this.dateFilter)
        : true;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }
} 