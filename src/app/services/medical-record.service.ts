import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface CreateMedicalRecordDTO {
  symptoms: string;
  medicalHistory: string;
  allergies: string;
  diagnosis: string;
  testResults: string;
  prescription: string;
  notes?: string;
  relativeName?: string;
  relativeIdCard?: string;
  patientName?: string;
}

export interface MedicalRecordDTO {
  recordId: number;
  patientName: string;
  gender: string;
  address: string;
  insuranceNumber: string;
  symptoms: string;
  medicalHistory: string;
  allergies: string;
  diagnosis: string;
  testResults: string;
  prescription: string;
  notes?: string;
  relativeName?: string;
  relativeIdCard?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private baseUrl = 'http://localhost:8080/api/medical-records';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createMedicalRecord(patientId: number, record: CreateMedicalRecordDTO): Observable<MedicalRecordDTO> {
    if (!patientId) {
      return throwError(() => new Error('ID bệnh nhân không hợp lệ'));
    }
    
    if (!record.symptoms || !record.medicalHistory || !record.diagnosis || !record.prescription) {
      return throwError(() => new Error('Thiếu thông tin bắt buộc'));
    }
    
    return this.http.post<MedicalRecordDTO>(
      `${this.baseUrl}/create/${patientId}`, 
      record,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Lỗi khi tạo hồ sơ bệnh án:', error);
        return throwError(() => error);
      })
    );
  }

  createRelativeMedicalRecord(patientId: number, appointmentId: number, record: CreateMedicalRecordDTO): Observable<MedicalRecordDTO> {
    if (!patientId) {
      return throwError(() => new Error('ID bệnh nhân không hợp lệ'));
    }
    
    if (!appointmentId) {
      return throwError(() => new Error('ID cuộc hẹn không hợp lệ'));
    }
    
    if (!record.symptoms || !record.medicalHistory || !record.diagnosis || !record.prescription) {
      return throwError(() => new Error('Thiếu thông tin bắt buộc'));
    }
    
    return this.http.post<MedicalRecordDTO>(
      `${this.baseUrl}/create-relative/${patientId}/${appointmentId}`,
      record,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Lỗi khi tạo hồ sơ bệnh án cho người thân:', error);
        return throwError(() => error);
      })
    );
  }

  getMedicalRecords(): Observable<MedicalRecordDTO[]> {
    return this.http.get<MedicalRecordDTO[]>(
      `${this.baseUrl}/list`,
      { headers: this.getHeaders() }
    );
  }

  getMedicalRecordById(id: number): Observable<MedicalRecordDTO> {
    return this.http.get<MedicalRecordDTO>(
      `${this.baseUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }

  getMedicalRecordsByPatientId(patientId: number): Observable<MedicalRecordDTO[]> {
    return this.http.get<MedicalRecordDTO[]>(
      `${this.baseUrl}/patient/${patientId}`,
      { headers: this.getHeaders() }
    );
  }
} 