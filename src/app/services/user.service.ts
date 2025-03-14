import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/patient';

  constructor(private http: HttpClient) { }

  getPatientProfiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profiles`);
  }

  getUserProfileById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updatePatientProfile(userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, userData);
  }
} 