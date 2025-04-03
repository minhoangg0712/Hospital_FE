import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Department {
  departmentId: number;
  departmentName: string;
}

export interface User {
  userId: number;
  username: string;
  name: string;
  phone: string;
  email: string;
  gender: string;
  roleCode: string;
  departmentId: number;
  cccd: string;
  insuranceNumber: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentRequest {
  department: {
    departmentId: number;
  };
  appointmentDate: string;
  reason: string;
  status: string;
  relativeName: string | null;
  relativeIdCard: string | null;
}

export interface Appointment {
  appointmentId: number;
  department: Department;
  user: User;
  reason: string;
  appointmentDate: string;
  status: string;
  relativeName: string | null;
  relativeIdCard: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    console.log('Headers being sent:', headers);
    return headers;
  }

  getAppointments(): Observable<Appointment[]> {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.roleCode === 'ROLE_MGR') {
      // Nếu là bác sĩ, sử dụng endpoint /api/appointments/department
      return this.http.get<Appointment[]>(`${this.apiUrl}/appointments/department`, { headers: this.getHeaders() });
    } else {
      // Nếu là nhân viên, sử dụng endpoint /api/appointments
      return this.http.get<Appointment[]>(`${this.apiUrl}/appointments`, { headers: this.getHeaders() });
    }
  }

  getAppointmentsByDepartment(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments/department`, { 
      headers: this.getHeaders() 
    });
  }

  // API cho bác sĩ
  getDoctorAppointments(): Observable<Appointment[]> {
    const params = new HttpParams().set('forSelf', 'true');
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments`, { 
      headers: this.getHeaders(),
      params: params
    });
  }

  getDoctorDepartmentAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments/department`, { 
      headers: this.getHeaders() 
    });
  }

  createDoctorAppointment(appointment: AppointmentRequest, forSelf: boolean): Observable<Appointment> {
    const params = new HttpParams().set('forSelf', forSelf.toString());
    return this.http.post<Appointment>(`${this.apiUrl}/appointments`, appointment, { 
      headers: this.getHeaders(),
      params: params
    });
  }

  updateDoctorAppointment(id: number, appointment: Appointment): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/appointments/${id}`, appointment, { 
      headers: this.getHeaders() 
    }).pipe(
      map(() => void 0)
    );
  }

  deleteDoctorAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/appointments/${id}`, { 
      headers: this.getHeaders() 
    }).pipe(
      map(() => void 0)
    );
  }

  // API cho phòng ban
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>('http://localhost:8080/api/departments', { 
      headers: this.getHeaders() 
    });
  }

  // API cho bệnh nhân
  createAppointment(appointmentData: any, forSelf: boolean): Observable<Appointment> {
    const params = new HttpParams().set('forSelf', forSelf.toString());
    return this.http.post<Appointment>(`${this.apiUrl}/appointments`, appointmentData, {
      headers: this.getHeaders(),
      params: params
    });
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/appointments/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(() => void 0)
    );
  }

  // API cho bệnh nhân
  getPatientAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments`, { headers: this.getHeaders() });
  }

  createPatientAppointment(appointmentData: AppointmentRequest, forSelf: boolean): Observable<Appointment> {
    const params = new HttpParams().set('forSelf', forSelf.toString());
    return this.http.post<Appointment>(`${this.apiUrl}/appointments`, appointmentData, {
      headers: this.getHeaders(),
      params: params
    });
  }

  deletePatientAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/appointments/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(() => void 0)
    );
  }

  updateAppointmentStatus(appointmentId: number, status: string): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/appointments/${appointmentId}/status`,
      { status },
      { headers: this.getHeaders() }
    );
  }

  checkDuplicateAppointment(appointmentDate: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/appointments/check`, {
      params: new HttpParams().set('date', appointmentDate),
      headers: this.getHeaders()
    });
  }
}