import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { UserService, UserDTO } from '../../services/user.service';

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
  viewMode: 'personal' | 'department' = 'personal';
  searchTerm: string = '';
  statusFilter: string = '';
  isLoading = false;
  errorMessage = '';
  currentUser: UserDTO | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Log thông tin user hiện tại
    this.userService.getCurrentUserProfile().subscribe({
      next: (user) => {
        console.log('Current user:', user);
        this.currentUser = user;
        this.loadMyAppointments();
      },
      error: (error) => {
        console.error('Lỗi khi tải thông tin user:', error);
        this.errorMessage = 'Có lỗi xảy ra khi tải thông tin người dùng';
      }
    });
  }

  loadMyAppointments() {
    this.isLoading = true;
    this.errorMessage = '';
    this.viewMode = 'personal';
    
    console.log('Đang gọi API getAppointmentsByDepartment...');
    this.appointmentService.getAppointmentsByDepartment().subscribe({
      next: (appointments) => {
        console.log('Dữ liệu lịch hẹn:', appointments);
        this.appointments = appointments;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải lịch hẹn:', error);
        this.errorMessage = 'Có lỗi xảy ra khi tải lịch hẹn';
        this.isLoading = false;
      }
    });
  }

  loadDepartmentAppointments() {
    this.loadMyAppointments(); // Vì MGR đã xem theo department rồi
  }

  updateStatus(appointmentId: number, status: string) {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.appointmentService.updateDoctorAppointment(appointmentId, { status } as Appointment)
      .subscribe({
        next: () => {
          this.loadMyAppointments();
        },
        error: (error) => {
          console.error('Lỗi khi cập nhật trạng thái:', error);
          this.errorMessage = 'Có lỗi xảy ra khi cập nhật trạng thái';
          this.isLoading = false;
        }
      });
  }

  createMedicalRecord(appointment: Appointment) {
    this.router.navigate(['/create-medical-record'], {
      queryParams: {
        patientId: appointment.user.userId,
        patientName: appointment.user.name,
        gender: appointment.user.gender,
        address: appointment.user.address,
        insuranceNumber: appointment.user.insuranceNumber
      }
    });
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
      const matchesSearch = this.searchTerm ? 
        appointment.user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        appointment.user.phone.includes(this.searchTerm) ||
        appointment.reason.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      const matchesStatus = this.statusFilter ? 
        appointment.status === this.statusFilter 
        : true;

      return matchesSearch && matchesStatus;
    });
  }
} 