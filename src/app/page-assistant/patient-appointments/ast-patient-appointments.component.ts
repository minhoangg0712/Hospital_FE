// ast-patient-appointments.component.ts - Updated for standalone components
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  AssistantAppointmentsService,
  AppointmentDto,
  AppointmentStatus,
  AppointmentPriority,
  DoctorBriefDto,
} from '../../services/assistant-appointments.service';

interface Department {
  id: number;
  name: string;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  departmentId: number;
  avatar?: string;
  isAvailable: boolean;
}

interface Appointment {
  id: number;
  patientInfo: {
    name: string;
    age: number;
    phone: string;
    address: string;
    email?: string;
  };
  appointmentDateTime: Date;
  reason: string;
  department: string;
  departmentId: number;
  assignedDoctor?: string;
  assignedDoctorId?: number;
  status: 'Chờ xử lý' | 'Đã check-in' | 'Đã hủy' | 'Hoàn thành' | 'Không đến';
  priority: 'Thấp' | 'Trung bình' | 'Cao' | 'Khẩn cấp';
  notes?: string;
}

@Component({
  selector: 'app-ast-patient-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DatePipe],
  templateUrl: './ast-patient-appointments.component.html',
  styleUrls: ['./ast-patient-appointments.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AssistantPatientAppointmentsComponent implements OnInit {
  selectedDepartment: number = 0;
  showDoctorModal: boolean = false;
  selectedAppointment: Appointment | null = null;
  selectedDoctorId: number = 0;
  isLoading: boolean = false;
  modalLoading = false;
  confirming = false;
  modalDoctors: Doctor[] = []; 

  departments: Department[] = [
    { id: 0, name: 'Tất cả khoa' },
    { id: 1, name: 'Khoa Tim mạch' },
    { id: 2, name: 'Khoa Nhi' },
    { id: 3, name: 'Khoa Ngoại tổng hợp' },
    { id: 4, name: 'Khoa Sản' },
    { id: 5, name: 'Khoa Thần kinh' },
    { id: 6, name: 'Khoa Da liễu' },
    { id: 7, name: 'Khoa Mắt' },
    { id: 8, name: 'Khoa Chấn thương chỉnh hình' }
  ];

  doctors: Doctor[] = [
    { id: 1, name: 'BS. Nguyễn Văn Hùng', specialty: 'Tim mạch', departmentId: 1, isAvailable: true },
    { id: 2, name: 'BS. Trần Thị Lan', specialty: 'Nhi khoa', departmentId: 2, isAvailable: true },
    { id: 3, name: 'BS. Lê Minh Tuấn', specialty: 'Ngoại khoa', departmentId: 3, isAvailable: false },
    { id: 4, name: 'BS. Phạm Thị Hoa', specialty: 'Sản phụ khoa', departmentId: 4, isAvailable: true },
    { id: 5, name: 'BS. Hoàng Văn Nam', specialty: 'Thần kinh', departmentId: 5, isAvailable: true },
    { id: 6, name: 'BS. Vũ Thị Kim', specialty: 'Da liễu', departmentId: 6, isAvailable: true },
    { id: 7, name: 'BS. Ngô Thị Bích', specialty: 'Mắt', departmentId: 7, isAvailable: false },
    { id: 8, name: 'BS. Đỗ Minh Đức', specialty: 'Chấn thương chỉnh hình', departmentId: 8, isAvailable: true }
  ];

  appointments: Appointment[] = [
    // {
    //   id: 1,
    //   patientInfo: {
    //     name: 'Nguyễn Văn An',
    //     age: 45,
    //     phone: '0901234567',
    //     address: 'Hà Nội',
    //     email: 'nguyenvanan@email.com'
    //   },
    //   appointmentDateTime: new Date('2025-09-10T09:00:00'),
    //   reason: 'Khám tim mạch định kỳ, có triệu chứng đau ngực và khó thở khi vận động, cảm thấy mệt mỏi thường xuyên',
    //   department: 'Khoa Tim mạch',
    //   departmentId: 1,
    //   status: 'Chờ xử lý',
    //   priority: 'Cao',
    //   notes: 'Bệnh nhân có tiền sử bệnh tim'
    // },
    // {
    //   id: 2,
    //   patientInfo: {
    //     name: 'Trần Thị Bình',
    //     age: 32,
    //     phone: '0912345678',
    //     address: 'TP.HCM',
    //     email: 'tranthibinh@email.com'
    //   },
    //   appointmentDateTime: new Date('2025-09-10T10:30:00'),
    //   reason: 'Con bị sốt cao và ho kéo dài, không ăn ngon miệng',
    //   department: 'Khoa Nhi',
    //   departmentId: 2,
    //   assignedDoctor: 'BS. Trần Thị Lan',
    //   assignedDoctorId: 2,
    //   status: 'Đã check-in',
    //   priority: 'Trung bình'
    // },
    // {
    //   id: 3,
    //   patientInfo: {
    //     name: 'Lê Văn Cường',
    //     age: 38,
    //     phone: '0923456789',
    //     address: 'Đà Nẵng',
    //     email: 'levancuong@email.com'
    //   },
    //   appointmentDateTime: new Date('2025-09-10T14:00:00'),
    //   reason: 'Đau bụng dưới bên phải, nghi viêm ruột thừa',
    //   department: 'Khoa Ngoại tổng hợp',
    //   departmentId: 3,
    //   status: 'Chờ xử lý',
    //   priority: 'Khẩn cấp'
    // },
    // {
    //   id: 4,
    //   patientInfo: {
    //     name: 'Phạm Thị Dung',
    //     age: 28,
    //     phone: '0934567890',
    //     address: 'Hải Phòng',
    //     email: 'phamthidung@email.com'
    //   },
    //   appointmentDateTime: new Date('2025-09-10T15:30:00'),
    //   reason: 'Khám thai định kỳ lần 2',
    //   department: 'Khoa Sản',
    //   departmentId: 4,
    //   status: 'Đã hủy',
    //   priority: 'Thấp'
    // },
    // {
    //   id: 5,
    //   patientInfo: {
    //     name: 'Hoàng Văn Em',
    //     age: 55,
    //     phone: '0945678901',
    //     address: 'Cần Thơ',
    //     email: 'hoangvanem@email.com'
    //   },
    //   appointmentDateTime: new Date('2025-09-10T16:00:00'),
    //   reason: 'Đau đầu thường xuyên, chóng mặt, mất ngủ',
    //   department: 'Khoa Thần kinh',
    //   departmentId: 5,
    //   status: 'Chờ xử lý',
    //   priority: 'Cao'
    // },
    // {
    //   id: 6,
    //   patientInfo: {
    //     name: 'Vũ Thị Giang',
    //     age: 25,
    //     phone: '0956789012',
    //     address: 'Hưng Yên',
    //     email: 'vuthigiang@email.com'
    //   },
    //   appointmentDateTime: new Date('2025-09-10T11:00:00'),
    //   reason: 'Mụn trứng cá và viêm da',
    //   department: 'Khoa Da liễu',
    //   departmentId: 6,
    //   status: 'Chờ xử lý',
    //   priority: 'Thấp'
    // }
  ];

  filteredAppointments: Appointment[] = [];

  constructor(
    private router: Router,
    private api: AssistantAppointmentsService 
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;

    this.api.getAllAppointments().subscribe({
      next: (rows: AppointmentDto[]) => {
        // Map DTO từ BE -> model UI
        this.appointments = rows.map(this.mapDtoToUi);
        this.filterAppointments();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Load all appointments failed:', err);
        this.appointments = [];
        this.filteredAppointments = [];
        this.isLoading = false;
      }
    });
  }

  private mapDtoToUi = (a: AppointmentDto): Appointment => {
    const dt = a.appointmentDate ? new Date(a.appointmentDate) : new Date();

    return {
      id: a.appointmentId,
      patientInfo: {
        name: a.user?.name ?? '',
        age: 0,
        phone: a.user?.phone ?? '',
        address: a.user?.address ?? '',
        email: a.user?.email
      },
      appointmentDateTime: dt, 
      reason: a.reason || '',
      department: a.department?.departmentName || '',
      departmentId: a.department?.departmentId ?? 0,
      assignedDoctor: a.doctor?.name || undefined, 
      assignedDoctorId: a.doctor?.userId || undefined,
      status: this.mapStatusToVi(a.status),  
      priority: this.mapPriorityToVi(a.priority),   
      notes: undefined
    };
  };

  private mapStatusToVi(s: AppointmentStatus): Appointment['status'] {
    switch (s) {
      case 'PENDING':    return 'Chờ xử lý';
      case 'CHECKED_IN': return 'Đã check-in';
      case 'CANCELLED':  return 'Đã hủy';
      case 'COMPLETED':  return 'Hoàn thành';
      case 'NO_SHOW':    return 'Không đến';
      default:           return 'Chờ xử lý';
    }
  }

  private mapPriorityToVi(p: AppointmentPriority): Appointment['priority'] {
    switch (p) {
      case 'URGENT': return 'Khẩn cấp';
      case 'HIGH':   return 'Cao';
      case 'LOW':    return 'Thấp';
      default:       return 'Trung bình';
    }
  }

  filterAppointments(): void {
    if (this.selectedDepartment === 0) {
      this.filteredAppointments = this.appointments;
    } else {
      this.filteredAppointments = this.appointments.filter(
        appointment => appointment.departmentId === this.selectedDepartment
      );
    }
    
    // Sort by priority and appointment time
    this.filteredAppointments.sort((a, b) => {
      const priorityOrder = { 'Khẩn cấp': 4, 'Cao': 3, 'Trung bình': 2, 'Thấp': 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return a.appointmentDateTime.getTime() - b.appointmentDateTime.getTime();
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Đã check-in': return 'status-checked-in';
      case 'Đã hủy': return 'status-cancelled';
      case 'Chờ xử lý': return 'status-pending';
      case 'Hoàn thành': return 'status-completed';
      case 'Không đến': return 'status-no-show';
      default: return 'status-pending';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Khẩn cấp': return 'priority-urgent';
      case 'Cao': return 'priority-high';
      case 'Trung bình': return 'priority-medium';
      case 'Thấp': return 'priority-low';
      default: return 'priority-medium';
    }
  }

  truncateReason(reason: string, maxLength: number = 60): string {
    return reason.length > maxLength ? reason.substring(0, maxLength) + '...' : reason;
  }

  // openDoctorModal(appointment: Appointment): void {
  //   this.selectedAppointment = appointment;
  //   this.showDoctorModal = true;
  //   this.selectedDoctorId = 0;
  // }

  // closeDoctorModal(): void {
  //   this.showDoctorModal = false;
  //   this.selectedAppointment = null;
  //   this.selectedDoctorId = 0;
  // }

  getDoctorsByDepartment(): Doctor[] {
    if (!this.selectedAppointment) return [];
    return this.doctors.filter(doctor => 
      doctor.departmentId === this.selectedAppointment!.departmentId && doctor.isAvailable
    );
  }

  // confirmCheckIn(): void {
  //   if (this.selectedAppointment && this.selectedDoctorId > 0) {
  //     const selectedDoctor = this.doctors.find(d => d.id === this.selectedDoctorId);
  //     if (selectedDoctor) {
  //       const appointmentIndex = this.appointments.findIndex(
  //         a => a.id === this.selectedAppointment!.id
  //       );
  //       if (appointmentIndex !== -1) {
  //         this.appointments[appointmentIndex].assignedDoctor = selectedDoctor.name;
  //         this.appointments[appointmentIndex].assignedDoctorId = selectedDoctor.id;
  //         this.appointments[appointmentIndex].status = 'Đã check-in';
  //         this.filterAppointments();
  //       }
  //     }
  //     this.closeDoctorModal();
  //   }
  // }

  openDoctorModal(appointment: Appointment): void {
    this.selectedAppointment = appointment;
    this.selectedDoctorId = 0;
    this.modalDoctors = [];
    this.showDoctorModal = true;
    this.modalLoading = true;

    // Lấy bác sĩ theo khoa từ BE
    this.api.getDoctorsByDepartment(appointment.departmentId).subscribe({
      next: (list: DoctorBriefDto[]) => {
        this.modalDoctors = list.map(d => ({
          id: d.userId,
          name: d.name,
          specialty: d.specialty ?? '',
          departmentId: appointment.departmentId,
          isAvailable: true,   // nếu cần, gọi thêm API lịch BS để xác định
        }));
        this.modalLoading = false;
      },
      error: (err) => {
        console.error('Load doctors by department failed:', err);
        this.modalDoctors = [];
        this.modalLoading = false;
      }
    });
  }

  closeDoctorModal(): void {
    this.showDoctorModal = false;
    this.selectedAppointment = null;
    this.selectedDoctorId = 0;
    this.modalDoctors = [];
    this.modalLoading = false;
    this.confirming = false;
  }

  // NEW: gọi PUT confirm-appointment
  confirmCheckIn(): void {
    if (!this.selectedAppointment || this.selectedDoctorId <= 0) return;
    this.confirming = true;

    this.api.confirmAppointment(this.selectedAppointment.id, this.selectedDoctorId).subscribe({
      next: () => {
        const idx = this.appointments.findIndex(a => a.id === this.selectedAppointment!.id);
        const doc = this.modalDoctors.find(d => d.id === this.selectedDoctorId);
        if (idx !== -1 && doc) {
          this.appointments[idx].assignedDoctor = doc.name;
          this.appointments[idx].assignedDoctorId = doc.id;
          this.appointments[idx].status = 'Đã check-in';
          this.filterAppointments();
        }
        this.confirming = false;
        this.closeDoctorModal();
      },
      error: (err) => {
        console.error('Confirm appointment failed:', err);
        alert('Xác nhận check-in thất bại, vui lòng thử lại.');
        this.confirming = false;
      }
    });
  }

  cancelAppointment(a: Appointment): void {
    if (!confirm(`Hủy lịch hẹn của ${a.patientInfo.name}?`)) return;
    const i = this.appointments.findIndex(x => x.id === a.id);
    if (i !== -1) {
      this.appointments[i].status = 'Đã hủy';
      this.filterAppointments();
    }
  }

  refreshData(): void {
    this.loadAppointments();
  }

  // Statistical methods
  getPendingCount(): number {
    return this.filteredAppointments.filter(a => a.status === 'Chờ xử lý').length;
  }

  getCheckedInCount(): number {
    return this.filteredAppointments.filter(a => a.status === 'Đã check-in').length;
  }

  getUrgentCount(): number {
    return this.filteredAppointments.filter(a => a.priority === 'Khẩn cấp' && a.status === 'Chờ xử lý').length;
  }

  trackByAppointmentId(index: number, appointment: Appointment): number {
    return appointment.id;
  }

  navigateToHome(): void {
    this.router.navigate(['/assistant']);
  }

  navigateToSchedule(): void {
    this.router.navigate(['/assistant/doctor-schedule']);
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}