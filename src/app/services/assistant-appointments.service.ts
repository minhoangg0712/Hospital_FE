import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ❗ THAY bằng URL backend của anh nếu khác cổng
const API_BASE = 'http://localhost:8080';

export type AppointmentStatus =
  'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export type AppointmentPriority =
  'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | undefined;

export interface AppointmentDto {
  appointmentId: number;

  department: {
    departmentId: number;
    departmentName: string;
  };

  user: {
    userId: number;
    name: string;
    phone?: string;
    address?: string;
    email?: string;
    // các field khác từ BE nếu có cũng không sao
  };

  doctor?: {
    userId: number;
    name: string;
  } | null;

  reason: string;
  appointmentDate: string;

  status: AppointmentStatus;
  priority?: AppointmentPriority;
}

export interface DoctorBriefDto {
  userId: number;
  name: string;
  specialty?: string;
}

@Injectable({ providedIn: 'root' })
export class AssistantAppointmentsService {
  constructor(private http: HttpClient) {}

  getAllAppointments() {
    return this.http.get<AppointmentDto[]>(
      `${API_BASE}/api/assistant/all-appointments`
    );
  }
  getDoctorsByDepartment(departmentId: number) {
    return this.http.get<DoctorBriefDto[]>(`${API_BASE}/api/assistant/doctors/${departmentId}`);
  }

  confirmAppointment(appointmentId: number, doctorUserId: number) {
    return this.http.put(
      `${API_BASE}/api/assistant/confirm-appointment/${appointmentId}?doctorId=${doctorUserId}`,
      {},
      { responseType: 'text' as 'json' }
    );
  }
}
