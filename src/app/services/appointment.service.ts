import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  private apiUrl = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // API cho quản lý viên (ROLE_MGR)
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl, { 
      headers: this.getHeaders() 
    });
  }

  getAppointmentsByDepartment(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/department`, { 
      headers: this.getHeaders() 
    });
  }

  // API cho bác sĩ
  getDoctorAppointments(): Observable<Appointment[]> {
    const params = new HttpParams().set('forSelf', 'true');
    return this.http.get<Appointment[]>(`${this.apiUrl}`, { 
      headers: this.getHeaders(),
      params: params
    });
  }

  getDoctorDepartmentAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/department`, { 
      headers: this.getHeaders() 
    });
  }

  createDoctorAppointment(appointment: AppointmentRequest, forSelf: boolean): Observable<Appointment> {
    const params = new HttpParams().set('forSelf', forSelf.toString());
    return this.http.post<Appointment>(`${this.apiUrl}`, appointment, { 
      headers: this.getHeaders(),
      params: params
    });
  }

  updateDoctorAppointment(id: number, appointment: Appointment): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, appointment, { 
      headers: this.getHeaders() 
    }).pipe(
      map(() => void 0)
    );
  }

  deleteDoctorAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { 
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
    return this.http.post<Appointment>(this.apiUrl, appointmentData, {
      headers: this.getHeaders(),
      params: params
    });
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(() => void 0)
    );
  }

  // API cho bệnh nhân
  getPatientAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createPatientAppointment(appointmentData: AppointmentRequest, forSelf: boolean): Observable<Appointment> {
    const params = new HttpParams().set('forSelf', forSelf.toString());
    return this.http.post<Appointment>(`${this.apiUrl}`, appointmentData, {
      headers: this.getHeaders(),
      params: params
    });
  }

  deletePatientAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(() => void 0)
    );
  }
}