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
  searchTerm: string = '';
  statusFilter: string = '';
  isLoading = false;
  errorMessage = '';
  currentUser: UserDTO | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getCurrentUserProfile().subscribe({
      next: (user) => {
        console.log('Current user:', user);
        this.currentUser = user;
        this.loadAppointments();
      },
      error: (error) => {
        console.error('Lỗi khi tải thông tin user:', error);
        this.errorMessage = 'Có lỗi xảy ra khi tải thông tin người dùng';
      }
    });
  }

  loadAppointments() {
    this.isLoading = true;
    this.errorMessage = '';
    
    console.log('Đang gọi API getAppointmentsByDepartment...');
    this.appointmentService.getAppointmentsByDepartment().subscribe({
      next: (appointments) => {
        console.log('Dữ liệu lịch hẹn:', appointments);
        this.appointments = appointments;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải lịch hẹn:', error);
        if (error.status === 403) {
          this.errorMessage = 'Bạn không có quyền xem danh sách lịch hẹn';
        } else {
          this.errorMessage = 'Có lỗi xảy ra khi tải lịch hẹn';
        }
        this.isLoading = false;
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