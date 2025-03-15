import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  
  constructor(private http: HttpClient) { }
  
  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    return this.http.post(`${this.baseUrl}/login`, { username, password }, {
      headers: headers
    });
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
      name: formData.name || '',
      username: formData.username || '',
      password: formData.password || '',
      email: formData.email || '',
      phone: formData.phone ? String(formData.phone) : '',
      address: formData.address || '',
      cccd: formData.cccd ? String(formData.cccd) : '',
      insuranceNumber: formData.insuranceNumber ? String(formData.insuranceNumber) : '',
      gender: formData.gender || ''
    };
    
    console.log('Dữ liệu gửi đến API:', payload);
    
    return this.http.post(`${this.baseUrl}/register`, payload, {
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
    return !!this.getToken();
  }
}
