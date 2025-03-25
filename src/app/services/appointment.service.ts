import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  relativeName: string | null;
  relativeIdCard: string | null;
  reason: string;
}

export interface Appointment {
  id?: number;
  title: string;
  start: string;
  end: string;
  patientName: string;
  doctorName: string;
  status: string;
  description?: string;
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

  createAppointment(appointmentData: AppointmentRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, appointmentData, { headers: this.getHeaders() });
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getAppointmentsByDepartment(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/department`, { headers: this.getHeaders() });
  }

  updateAppointment(id: number, appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, appointment, { headers: this.getHeaders() });
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>('http://localhost:8080/api/departments/list', { headers: this.getHeaders() });
  }
} 