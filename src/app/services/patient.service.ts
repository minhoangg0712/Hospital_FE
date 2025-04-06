import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserDTO } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:8080/api/patient';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Đã xảy ra lỗi không xác định';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.status === 400) {
        errorMessage = error.error.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
      } else if (error.status === 401) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      } else if (error.status === 403) {
        errorMessage = 'Bạn không có quyền thực hiện thao tác này.';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    console.error('Error details:', error);
    return throwError(() => new Error(errorMessage));
  }

  // Lấy danh sách bệnh nhân theo department
  getPatientsByDepartment(departmentId: number): Observable<UserDTO[]> {
    console.log('Calling getPatientsByDepartment with departmentId:', departmentId);
    return this.http.get<UserDTO[]>(`${this.apiUrl}/profiles`, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  // Lấy chi tiết hồ sơ bệnh nhân
  getPatientProfile(patientId: number): Observable<UserDTO> {
    console.log('Calling getPatientProfile with patientId:', patientId);
    console.log('Headers:', this.getHeaders());
    
    return this.http.get<UserDTO>(`${this.apiUrl}/profile/${patientId}`, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Full error response:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.error);
        return this.handleError(error);
      })
    );
  }
} 