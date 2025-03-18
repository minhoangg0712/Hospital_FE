import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface UserDTO {
  userId: number;
  name: string;
  phone: string;
  email: string;
  gender: string;
  roleCode: string;
  departmentId?: number;
  cccd: string;
  insuranceNumber: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080';
  private apiUrl = this.baseUrl + '/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Đã xảy ra lỗi!';
    
    if (error.error instanceof ErrorEvent) {
      // Lỗi client-side
      errorMessage = error.error.message;
    } else {
      // Lỗi server-side
      if (error.status === 403) {
        errorMessage = 'Bạn không có quyền truy cập thông tin này';
      } else if (error.status === 404) {
        errorMessage = 'Không tìm thấy thông tin người dùng';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  // Lấy danh sách hồ sơ bệnh nhân
  getPatientProfiles(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/patient/profiles`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Lấy hồ sơ chi tiết theo ID
  getUserProfileById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/patient/profile/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Lấy thông tin cá nhân của user đang đăng nhập
  getCurrentUserProfile(): Observable<UserDTO> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('Không tìm thấy token xác thực'));
    }

    try {
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const role = payload.role;
      const userId = payload.userId || payload.sub;

      // Chọn endpoint dựa trên role
      if (role === 'ROLE_DOCTOR' || role === 'ROLE_MGR') {
        return this.getDoctorProfile();
      } else {
        return this.getUserProfileById(Number(userId));
      }
    } catch (error) {
      return throwError(() => new Error('Token không hợp lệ'));
    }
  }

  // Lấy thông tin bác sĩ
  private getDoctorProfile(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/patient/Doctorprofile`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Cập nhật hồ sơ
  updateUserProfile(user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/patient/profile/update`, user, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Đổi mật khẩu
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const body = {
      oldPassword,
      newPassword
    };
    
    return this.http.post(`${this.baseUrl}/api/auth/change-password`, body, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}