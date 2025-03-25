import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export interface Doctor {
  doctorId: number;
  doctorName: string;
  departmentId: number;
  departmentName: string;
  specialization: string;
  phoneNumber: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private baseUrl = 'http://localhost:8080/api/doctors';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  getDoctorsByDepartment(departmentId: number): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.baseUrl}/department/${departmentId}`);
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.baseUrl}/${id}`);
  }
} 