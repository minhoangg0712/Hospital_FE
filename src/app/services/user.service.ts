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
  departmentId: number;
  cccd: string;
  insuranceNumber: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
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
      // Lỗi phía client
      errorMessage = error.error.message;
    } else {
      // Lỗi phía server
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


  // Lấy danh sách hồ sơ bệnh nhân
  getPatientProfiles(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/profiles`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }


  // Lấy hồ sơ chi tiết theo ID
  getUserProfileById(id: number): Observable<UserDTO> {
    console.log('Calling getUserProfileById with ID:', id);
    console.log('Headers:', this.getHeaders());
    
    return this.http.get<UserDTO>(`${this.apiUrl}/profile/${id}`, { 
      headers: this.getHeaders(),
      withCredentials: true 
    }).pipe(catchError(this.handleError));
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

      console.log('Token:', token);
      console.log('Token payload:', payload);
      console.log('Role:', role);
      console.log('User ID:', userId);

      // Chọn endpoint dựa trên role
      if (role === 'ROLE_DOCTOR' || role === 'ROLE_MGR') {
        return this.getDoctorProfile();
      } else {
        return this.getUserProfileById(Number(userId));
      }
    } catch (error) {
      console.error('Token parsing error:', error);
      return throwError(() => new Error('Token không hợp lệ'));
    }
  }


  // Lấy thông tin bác sĩ
  private getDoctorProfile(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/Doctorprofile`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }


  // Cập nhật hồ sơ
  updateUserProfile(user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/profile/update`, user, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }


  // Đổi mật khẩu
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, {
      oldPassword,
      newPassword
    }, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  getUserById(userId: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/profile/${userId}`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }
}

