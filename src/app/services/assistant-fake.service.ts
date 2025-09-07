import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Doctor {
  id: number;
  name: string;
  specialty?: string;
}

export interface DoctorSchedule {
  id: number;
  doctorId: number;
  doctorName: string;
  date: string;      // ISO yyyy-mm-dd
  startTime: string; // "08:00"
  endTime: string;   // "12:00"
  room?: string;
}

@Injectable({ providedIn: 'root' })
export class AssistantFakeService {
  public doctors: Doctor[] = [
    { id: 1, name: 'Dr. Nguyễn Văn A', specialty: 'Nhi' },
    { id: 2, name: 'Dr. Trần Thị B', specialty: 'Nội' },
    { id: 3, name: 'Dr. Lê Văn C', specialty: 'Sản' },
    { id: 4, name: 'Dr. Hoàng D', specialty: 'Răng' },
  ];

  public schedules: DoctorSchedule[] = [
    { id: 1, doctorId: 1, doctorName: 'Dr. Nguyễn Văn A', date: '2025-09-08', startTime: '08:00', endTime: '12:00', room: '101' },
    { id: 2, doctorId: 2, doctorName: 'Dr. Trần Thị B', date: '2025-09-08', startTime: '10:00', endTime: '14:00', room: '102' },
    { id: 3, doctorId: 1, doctorName: 'Dr. Nguyễn Văn A', date: '2025-09-09', startTime: '13:00', endTime: '17:00', room: '101' },
    { id: 4, doctorId: 3, doctorName: 'Dr. Lê Văn C', date: '2025-09-08', startTime: '07:30', endTime: '11:30', room: '103' }
  ];

  getDoctors(): Observable<Doctor[]> {
    return of(this.doctors);
  }

  getSchedules(): Observable<DoctorSchedule[]> {
    return of(this.schedules);
  }

  getSchedulesByDoctorName(name: string): Observable<DoctorSchedule[]> {
    if (!name) return of(this.schedules);
    const lower = name.toLowerCase();
    return of(this.schedules.filter(s => s.doctorName.toLowerCase().includes(lower)));
  }
}
