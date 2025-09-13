// ast-doctor-schedule.component.ts - Updated for standalone components
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  AssistantDoctorsService,
  DoctorDto,
  DoctorScheduleDto,
} from '../../services/assistant-doctors.service';
import { forkJoin, of, catchError, map, switchMap } from 'rxjs';

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
    // {
    //   id: 1,
    //   name: 'BS. Nguyễn Văn Hùng',
    //   specialty: 'Tim mạch',
    //   department: 'Khoa Tim mạch',
    //   workingHours: '8:00 - 17:00',
    //   workingDays: 'Thứ 2 - Thứ 6',
    //   status: 'Đang trực',
    //   avatar: 'assets/images/doctor-1.jpg'
    // },
    // {
    //   id: 2,
    //   name: 'BS. Trần Thị Lan',
    //   specialty: 'Nhi khoa',
    //   department: 'Khoa Nhi',
    //   workingHours: '7:30 - 16:30',
    //   workingDays: 'Thứ 2 - Thứ 7',
    //   status: 'Đang trực',
    //   avatar: 'assets/images/doctor-2.jpg'
    // },
    // {
    //   id: 3,
    //   name: 'BS. Lê Minh Tuấn',
    //   specialty: 'Ngoại khoa',
    //   department: 'Khoa Ngoại tổng hợp',
    //   workingHours: '6:00 - 14:00',
    //   workingDays: 'Thứ 3 - Chủ nhật',
    //   status: 'Nghỉ phép',
    //   avatar: 'assets/images/doctor-3.jpg'
    // },
    // {
    //   id: 4,
    //   name: 'BS. Phạm Thị Hoa',
    //   specialty: 'Sản phụ khoa',
    //   department: 'Khoa Sản',
    //   workingHours: '8:00 - 17:00',
    //   workingDays: 'Thứ 2 - Thứ 6',
    //   status: 'Đang trực',
    //   avatar: 'assets/images/doctor-4.jpg'
    // },
    // {
    //   id: 5,
    //   name: 'BS. Hoàng Văn Nam',
    //   specialty: 'Thần kinh',
    //   department: 'Khoa Thần kinh',
    //   workingHours: '9:00 - 18:00',
    //   workingDays: 'Thứ 2 - Thứ 7',
    //   status: 'Đang phẫu thuật',
    //   avatar: 'assets/images/doctor-5.jpg'
    // },
    // {
    //   id: 6,
    //   name: 'BS. Vũ Thị Kim',
    //   specialty: 'Da liễu',
    //   department: 'Khoa Da liễu',
    //   workingHours: '8:30 - 17:30',
    //   workingDays: 'Thứ 2 - Thứ 6',
    //   status: 'Đang trực',
    //   avatar: 'assets/images/doctor-6.jpg'
    // },
    // {
    //   id: 7,
    //   name: 'BS. Đỗ Minh Đức',
    //   specialty: 'Chấn thương chỉnh hình',
    //   department: 'Khoa Chấn thương chỉnh hình',
    //   workingHours: '7:00 - 15:00',
    //   workingDays: 'Thứ 3 - Chủ nhật',
    //   status: 'Đang trực',
    //   avatar: 'assets/images/doctor-7.jpg'
    // },
    // {
    //   id: 8,
    //   name: 'BS. Ngô Thị Bích',
    //   specialty: 'Mắt',
    //   department: 'Khoa Mắt',
    //   workingHours: '8:00 - 16:00',
    //   workingDays: 'Thứ 2 - Thứ 6',
    //   status: 'Nghỉ phép',
    //   avatar: 'assets/images/doctor-8.jpg'
    // }
  ];
  
  filteredDoctors: Doctor[] = [];

  constructor(
    private router: Router,
    private api: AssistantDoctorsService,
  ) { }

  ngOnInit(): void {
    this.filteredDoctors = this.doctors;
    this.loadDoctorSchedules();
  }

  loadDoctorSchedules(): void {
    this.isLoading = true;

    this.api.getAllDoctors().pipe(
      // Tải lịch làm việc cho từng bác sĩ
      // gom lại { doc, schedule[] }
      // Nếu có nhiều, dùng forkJoin; nếu 0 thì of([])
      // Lưu ý: có thể nặng nếu nhiều bác sĩ; tối ưu sau bằng lazy/modal tuỳ nhu cầu
      switchMap((docs: DoctorDto[]) => {
        if (!docs.length) return of([] as Array<{ doc: DoctorDto; schedule: DoctorScheduleDto[] }>);
        const calls = docs.map((doc) =>
          this.api.getDoctorSchedule(doc.userId).pipe(
            catchError(() => of([] as DoctorScheduleDto[])),
            map((schedule) => ({ doc, schedule }))
          )
        );
        return forkJoin(calls);
      })
    ).subscribe({
      next: (pairs) => {
        // Map sang model UI
        this.doctors = pairs.map(({ doc, schedule }) => this.mapToUi(doc, schedule));
        this.filteredDoctors = this.doctors;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Load doctors failed:', err);
        this.doctors = [];
        this.filteredDoctors = [];
        this.isLoading = false;
      }
    });
  }

  private mapToUi(doc: DoctorDto, schedule: DoctorScheduleDto[]): Doctor {
    const deptName = doc.departmentName ?? '—';
    const specialty = doc.specialty ?? '—';

    // Tóm tắt giờ làm việc: nếu có ca hôm nay -> [min start - max end], else lấy ca đầu
    const todayStr = this.formatDate(new Date()); // yyyy-MM-dd
    const todayShifts = schedule.filter(s => s.date === todayStr);

    let workingHours = '—';
    if (todayShifts.length) {
      const minStart = this.minTime(todayShifts.map(s => s.startTime));
      const maxEnd = this.maxTime(todayShifts.map(s => s.endTime));
      workingHours = `${minStart} - ${maxEnd}`;
    } else if (schedule.length) {
      workingHours = `${schedule[0].startTime} - ${schedule[0].endTime}`;
    }

    // Tóm tắt ngày làm việc: liệt kê các thứ trong tuần có lịch
    const days = Array.from(new Set(schedule.map(s => this.vnDay(new Date(s.date).getDay()))));
    const workingDays = days.length ? days.join(', ') : '—';

    // Suy đoán status: nếu có ca hôm nay và "bây giờ" nằm trong 1 trong các khoảng -> Đang trực, không thì Nghỉ phép
    const now = this.timeStr(new Date()); // HH:mm
    const onDuty = todayShifts.some(s => s.startTime <= now && now <= s.endTime);
    const status = onDuty ? 'Đang trực' : 'Nghỉ phép';

    return {
      id: doc.userId,
      name: doc.name,
      specialty,
      department: deptName,
      workingHours,
      workingDays,
      status,
      avatar: undefined
    };
  }

  private formatDate(d: Date) {
    // yyyy-MM-dd
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  private timeStr(d: Date) {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  private minTime(times: string[]) { return times.slice().sort()[0]; }
  private maxTime(times: string[]) { return times.slice().sort().pop() as string; }
  private vnDay(dow: number) {
    // 0=CN,1=Th2,...
    return ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'][dow] ?? '';
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