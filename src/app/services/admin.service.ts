import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateDoctorRequest {
  username: string;
  password: string;
  departmentId: number;
}

export interface Doctor {
  id: number;
  username: string;
  department: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createDoctorAccount(request: CreateDoctorRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-doctor`, request, {
      headers: this.getHeaders()
    });
  }

  getDoctorList(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/doctors`, {
      headers: this.getHeaders()
    });
  }

  deleteDoctor(doctorId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/doctors/${doctorId}`, {
      headers: this.getHeaders()
    });
  }
} 