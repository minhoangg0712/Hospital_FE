import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserDTO } from './user.service';

export interface Department {
  departmentId: number;
  departmentName: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  getAllDepartments(): Observable<Department[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return new Observable(subscriber => subscriber.error('Không tìm thấy token'));
    }

    return this.http.get<Department[]>(`${this.baseUrl}/departments`, { 
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(error => {
        if (error.status === 403) {
          alert('Bạn không có quyền truy cập danh sách phòng ban. Vui lòng liên hệ quản trị viên.');
          this.router.navigate(['/home']);
        }
        throw error;
      })
    );
  }

  getDepartments(): Observable<Department[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return new Observable(subscriber => subscriber.error('Không tìm thấy token'));
    }

    return this.http.get<Department[]>(`${this.baseUrl}/departments`, { 
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
  }

  getDepartmentById(id: number): Observable<Department> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return new Observable(subscriber => subscriber.error('Không tìm thấy token'));
    }

    return this.http.get<Department>(`${this.baseUrl}/departments/${id}`, { 
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
  }

  getPatientByDepartment(departmentId: number, patientId: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/departments/${departmentId}/patients/${patientId}`);
  }

  getPatientsByDepartment(departmentId: number): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.baseUrl}/departments/${departmentId}/patients`);
  }
} 