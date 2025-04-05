import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { UserService, UserDTO } from '../../services/user.service';
import { MedicalRecordService } from '../../services/medical-record.service';

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
  isLoading = false;
  errorMessage = '';
  currentUser: UserDTO | null = null;
  selectedDate: string = new Date().toISOString().split('T')[0];
  noAppointmentsMessage: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private userService: UserService,
    private medicalRecordService: MedicalRecordService,
    private router: Router
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
    
    console.log('Đang gọi API getDoctorDepartmentAppointments...');
    this.appointmentService.getDoctorDepartmentAppointments().subscribe({
      next: (appointments) => {
        console.log('Dữ liệu lịch hẹn:', appointments);
        this.appointments = appointments;
        this.isLoading = false;
        
        // Kiểm tra xem có lịch hẹn nào cho ngày đã chọn không
        this.checkAppointmentsForSelectedDate();
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

  createMedicalRecord(patientId: number, appointmentId: number): void {
    this.router.navigate(['/doctor/create-medical-record'], {
      queryParams: {
        patientId: patientId,
        appointmentId: appointmentId
      }
    });
  }

  onDateChange(): void {
    console.log('Ngày đã chọn:', this.selectedDate);
    this.checkAppointmentsForSelectedDate();
  }
  
  checkAppointmentsForSelectedDate(): void {
    const appointmentsForDate = this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate).toISOString().split('T')[0];
      return appointmentDate === this.selectedDate;
    });
    
    console.log(`Số lịch hẹn cho ngày ${this.selectedDate}: ${appointmentsForDate.length}`);
    
    if (appointmentsForDate.length === 0) {
      this.noAppointmentsMessage = `Không có lịch hẹn nào vào ngày ${this.formatDate(this.selectedDate)}`;
      console.log(this.noAppointmentsMessage);
    } else {
      this.noAppointmentsMessage = '';
    }
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }

  get filteredAppointments(): Appointment[] {
    return this.appointments.filter(appointment => {
      const matchesSearch = this.searchTerm ? 
        appointment.user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        appointment.user.phone.includes(this.searchTerm) ||
        appointment.reason.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      const appointmentDate = new Date(appointment.appointmentDate).toISOString().split('T')[0];
      const matchesDate = appointmentDate === this.selectedDate;

      return matchesSearch && matchesDate;
    });
  }
} 