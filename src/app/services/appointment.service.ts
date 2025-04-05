import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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
  relativeName: string | null;
  relativeIdCard: string | null;
  status?: string;
}

export interface Appointment {
  appointmentId: number;
  department: Department;
  user: User;
  reason: string;
  appointmentDate: string;
  relativeName: string | null;
  relativeIdCard: string | null;
  status: string;
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
    });
  }

  deleteDoctorAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(() => void 0)
    );
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/departments`, {
      headers: this.getHeaders()
    });
  }

  // API cho bệnh nhân
  createAppointment(appointmentData: AppointmentRequest, forSelf: boolean): Observable<Appointment> {
    // Kiểm tra dữ liệu trước khi gửi
    console.log('Sending appointment data:', appointmentData);
    
    // Đảm bảo departmentId là số
    if (appointmentData.department && typeof appointmentData.department.departmentId === 'string') {
      appointmentData.department.departmentId = parseInt(appointmentData.department.departmentId);
    }
    
    // Đảm bảo status là một trong các giá trị hợp lệ theo ENUM trong DB
    const validStatuses = ['Scheduled', 'Completed', 'Cancelled'];
    if (!appointmentData.status || !validStatuses.includes(appointmentData.status)) {
      appointmentData.status = 'Scheduled'; // Giá trị mặc định theo DB
    }
    
    // Đảm bảo các trường bắt buộc có giá trị
    if (appointmentData.relativeName === undefined) {
      appointmentData.relativeName = null;
    }
    if (appointmentData.relativeIdCard === undefined) {
      appointmentData.relativeIdCard = null;
    }
    
    // Kiểm tra token
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'));
    }
    
    const params = new HttpParams().set('forSelf', forSelf.toString());
    return this.http.post<Appointment>(this.apiUrl, appointmentData, {
      headers: this.getHeaders(),
      params: params
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating appointment:', error);
        
        // Hiển thị chi tiết lỗi từ server
        let errorMessage = 'Không thể đăng ký lịch khám.';
        
        // Kiểm tra response body
        if (error.error) {
          console.log('Error response body:', error.error);
          
          if (typeof error.error === 'string') {
            errorMessage += ` ${error.error}`;
          } else if (error.error.message) {
            errorMessage += ` ${error.error.message}`;
          } else if (error.error.errors) {
            // Nếu có nhiều lỗi
            const errorDetails = error.error.errors.map((e: any) => e.message).join(', ');
            errorMessage += ` ${errorDetails}`;
          } else if (error.error.error) {
            errorMessage += ` ${error.error.error}`;
          }
        } else if (error.status === 400) {
          errorMessage += ' Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
        } else if (error.status === 401) {
          errorMessage += ' Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.status === 403) {
          errorMessage += ' Bạn không có quyền thực hiện thao tác này.';
        } else if (error.status === 404) {
          errorMessage += ' Không tìm thấy tài nguyên.';
        } else if (error.status === 500) {
          errorMessage += ' Lỗi máy chủ. Vui lòng thử lại sau.';
        }
        
        console.error('Detailed error:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
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
    return this.http.get<Appointment[]>(`${this.apiUrl}/patient`, { 
      headers: this.getHeaders() 
    });
  }

  getAppointmentsByUserId(userId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/user/${userId}`, { 
      headers: this.getHeaders() 
    });
  }

  createPatientAppointment(appointmentData: AppointmentRequest, forSelf: boolean): Observable<Appointment> {
    const params = new HttpParams().set('forSelf', forSelf.toString());
    return this.http.post<Appointment>(`${this.apiUrl}/patient`, appointmentData, { 
      headers: this.getHeaders(),
      params: params
    });
  }

  deletePatientAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/patient/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(() => void 0)
    );
  }
}