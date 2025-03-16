import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = this.baseUrl + '/api/patient';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Không tìm thấy token xác thực');
    }
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }

  private getUserIdFromToken(): number {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Không tìm thấy token xác thực');
    }

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const userId = payload.userId || payload.sub;
        if (!userId) {
          throw new Error('Không tìm thấy userId trong token');
        }
        return Number(userId);
      }
      throw new Error('Token không hợp lệ');
    } catch (error) {
      console.error('Lỗi khi giải mã token:', error);
      throw new Error('Không thể lấy thông tin người dùng từ token');
    }
  }

  // Lấy danh sách hồ sơ bệnh nhân
  getPatientProfiles(): Observable<UserDTO[]> {
    const headers = this.getHeaders();
    return this.http.get<UserDTO[]>(`${this.apiUrl}/profiles`, { headers });
  }

  // Lấy hồ sơ chi tiết theo ID
  getUserProfile(id: number): Observable<UserDTO> {
    const headers = this.getHeaders();
    return this.http.get<UserDTO>(`${this.apiUrl}/${id}`, { headers });
  }

  // Lấy thông tin cá nhân của user đang đăng nhập
  getCurrentUserProfile(): Observable<UserDTO> {
    const headers = this.getHeaders();
    const userId = this.getUserIdFromToken();
    return this.http.get<UserDTO>(`${this.apiUrl}/${userId}`, { headers });
  }

  // Cập nhật hồ sơ bệnh nhân
  updateUserProfile(user: UserDTO): Observable<UserDTO> {
    const headers = this.getHeaders();
    return this.http.put<UserDTO>(`${this.apiUrl}/update`, user, { headers });
  }

  // Đổi mật khẩu
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const headers = this.getHeaders();
    const userId = this.getUserIdFromToken();
    
    const body = {
      userId,
      oldPassword,
      newPassword
    };
    
    return this.http.post(`${this.baseUrl}/api/auth/change-password`, body, { headers });
  }
}
