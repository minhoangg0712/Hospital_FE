import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
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

export interface CurrentUser {
  userId: number;
  name: string;
  username: string;
  roleCode: string;
  departmentId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  
  constructor(private http: HttpClient) { }
  
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { username, password })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
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
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token) as any;
        return decodedToken.role || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  getCurrentUser(): CurrentUser | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token) as any;
        return {
          userId: decodedToken.userId,
          name: decodedToken.name,
          username: decodedToken.username,
          roleCode: decodedToken.role,
          departmentId: decodedToken.departmentId
        };
      } catch {
        return null;
      }
    }
    return null;
  }
}
