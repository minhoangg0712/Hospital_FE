// Service cho trang bác sĩ (hard-code base URL)

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, of, switchMap, catchError, Observable } from 'rxjs';

// ❗ĐỔI nếu backend khác cổng
const API_BASE = 'http://localhost:8080';

export interface DepartmentDto {
  departmentId: number;
  departmentName: string;
}

export interface DoctorDto {
  userId: number;          // id bác sĩ (user id)
  name: string;            // tên
  specialty?: string;      // có thể null
  // BE có thể không trả kèm khoa trong endpoint /doctors/{dept}
  departmentId?: number;
  departmentName?: string;
}

export interface DoctorScheduleDto {
  date: string;            // yyyy-MM-dd
  startTime: string;       // HH:mm
  endTime: string;         // HH:mm
  room?: string;
}

@Injectable({ providedIn: 'root' })
export class AssistantDoctorsService {
  constructor(private http: HttpClient) {}

  // 8) Lấy tất cả khoa
  getDepartments(): Observable<DepartmentDto[]> {
    return this.http.get<DepartmentDto[]>(`${API_BASE}/api/assistant/departments`);
  }

  // 3) Lấy bác sĩ theo khoa
  getDoctorsByDepartment(departmentId: number): Observable<DoctorDto[]> {
    return this.http.get<DoctorDto[]>(`${API_BASE}/api/assistant/doctors/${departmentId}`);
  }

  // 4) Lịch làm việc của bác sĩ
  getDoctorSchedule(doctorId: number): Observable<DoctorScheduleDto[]> {
    return this.http.get<DoctorScheduleDto[]>(`${API_BASE}/api/assistant/doctor-schedule/${doctorId}`);
  }

  // Helper: Lấy ALL bác sĩ bằng cách quét mọi khoa
  getAllDoctors(): Observable<DoctorDto[]> {
    return this.getDepartments().pipe(
      switchMap((depts) => {
        if (!depts.length) return of([] as DoctorDto[]);
        const calls = depts.map((d) =>
          this.getDoctorsByDepartment(d.departmentId).pipe(
            map((list) =>
              list.map((doc) => ({
                ...doc,
                departmentId: doc.departmentId ?? d.departmentId,
                departmentName: doc.departmentName ?? d.departmentName,
              }))
            ),
            catchError(() => of([] as DoctorDto[]))
          )
        );
        return forkJoin(calls).pipe(map((chunks) => chunks.flat()));
      })
    );
  }
}
