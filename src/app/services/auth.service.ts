import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export interface RegisterRequest {
  name: string;
  username: string;
  password: string;
  phone: string;
  email: string;
  gender: string;
  cccd: string;
  insuranceNumber: string;
  address: string;
  roleCode: string;
}

export interface ForgotPasswordRequest {
  username: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();
  
  constructor(private http: HttpClient) {
    this.checkLoginStatus();
  }
  
  checkLoginStatus() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    this.isLoggedInSubject.next(!!token);
    this.userRoleSubject.next(userRole);
  }
  
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { username, password })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            
            // Xử lý role từ token
            const tokenParts = response.token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              let role = payload.role;
              
              // Chuẩn hóa role
              if (role === 'ROLE_DOCTOR' || role === 'DOCTOR') {
                role = 'DOCTOR';
              } else if (role === 'ROLE_MGR' || role === 'MGR') {
                role = 'MGR';
              } else if (role === 'ROLE_ADMIN' || role === 'ADMIN' || role === 'ROLE_ADM' || role === 'ADM') {
                role = 'ADM';
              } else if (role === 'ROLE_EMP' || role === 'EMP') {
                role = 'EMP';
              } else {
                role = 'PATIENT';
              }
              
              localStorage.setItem('userRole', role);
              this.isLoggedInSubject.next(true);
              this.userRoleSubject.next(role);
            }
          }
        })
      );
  }
  
  register(formData: {
    name: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    address: string;
    cccd: string;
    insuranceNumber: string;
    gender: string;
  }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    const payload: RegisterRequest = {
      name: formData.name,
      username: formData.username,
      password: formData.password,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      cccd: formData.cccd,
      insuranceNumber: formData.insuranceNumber,
      gender: formData.gender,
      roleCode: 'PATIENT'
    };
    
    console.log('Dữ liệu gửi đến API:', payload);
    
    return this.http.post(`${this.baseUrl}/register`, payload, {
      headers: headers
    });
  }
  
  forgotPassword(formData: ForgotPasswordRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post(`${this.baseUrl}/forgot-password`, formData, {
      headers: headers
    });
  }
  
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
    this.userRoleSubject.next(null);
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getUserRole(): string | null {
    return this.userRoleSubject.value;
  }
}
