import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

    const options = {
      headers: headers
    };

    return this.http.post(`${this.baseUrl}/login`, { username, password }, options);
  }

  register(username: string, password: string, email: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const options = {
      headers: headers
    };

    return this.http.post(`${this.baseUrl}/register`, { username, password, email }, options);
  }
}