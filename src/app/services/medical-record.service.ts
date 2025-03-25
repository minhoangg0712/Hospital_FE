import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MedicalRecordDTO {
  recordId?: number;
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
}

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private baseUrl = 'http://localhost:8080/api/medical-records';

  constructor(private http: HttpClient) { }

  createMedicalRecord(patientId: number, record: MedicalRecordDTO): Observable<MedicalRecordDTO> {
    return this.http.post<MedicalRecordDTO>(`${this.baseUrl}/create/${patientId}`, record);
  }

  getMedicalRecords(): Observable<MedicalRecordDTO[]> {
    return this.http.get<MedicalRecordDTO[]>(`${this.baseUrl}/list`);
  }

  getMedicalRecordById(id: number): Observable<MedicalRecordDTO> {
    return this.http.get<MedicalRecordDTO>(`${this.baseUrl}/${id}`);
  }
} 