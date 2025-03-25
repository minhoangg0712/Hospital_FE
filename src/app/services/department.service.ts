import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.get<Department[]>(`${this.baseUrl}/departments/list`).pipe(
      catchError(error => {
        if (error.status === 403) {
          alert('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.');
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        throw error;
      })
    );
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/departments`);
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.baseUrl}/departments/${id}`);
  }

  getPatientByDepartment(departmentId: number, patientId: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/departments/${departmentId}/patients/${patientId}`);
  }

  getPatientsByDepartment(departmentId: number): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.baseUrl}/departments/${departmentId}/patients`);
  }
} 