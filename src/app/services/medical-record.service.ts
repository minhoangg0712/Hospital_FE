import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private baseUrl = 'http://localhost:8080/api/medical-records';

  constructor(private http: HttpClient) { }

  createMedicalRecord(recordData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, recordData);
  }

  getMedicalRecords(): Observable<any> {
    return this.http.get(`${this.baseUrl}/list`);
  }

  getMedicalRecordById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
} 