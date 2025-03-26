import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

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
  id: number;
  patientName: string;
  title: string;
  start: string;
  end: string;
  status: string;
  description?: string;
  departmentId: number;
  departmentName: string;
  patientId: number;
  patientPhone: string;
  patientEmail: string;
  patientAddress: string;
  patientGender: string;
  patientCccd: string;
  patientInsuranceNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8080/api/appointments';
  private token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }

  // API cho quản lý viên (ROLE_MGR)
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getAppointmentsByDepartment(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/department`, { headers: this.getHeaders() });
  }

  // API cho bác sĩ
  createAppointment(appointmentData: AppointmentRequest, forSelf: boolean): Observable<any> {
    const params = new HttpParams().set('forSelf', forSelf.toString());
    return this.http.post(`${this.apiUrl}`, appointmentData, { 
      headers: this.getHeaders(),
      params: params
    });
  }

  updateAppointment(id: number, appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, appointment, { headers: this.getHeaders() });
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // API cho phòng ban
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>('http://localhost:8080/api/departments', { headers: this.getHeaders() });
  }
} 