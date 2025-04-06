import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Medicine {
  medicineId: number;
  name: string;
  description: string;
  unitPrice: number;
  imageUrl: string;
  createdAt: string;
  quantity?: number;
  unit?: string;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private apiUrl = 'http://localhost:8080/api/medicines';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(this.apiUrl, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      catchError(error => {
        console.error('Lỗi khi lấy danh sách thuốc:', error);
        return throwError(() => new Error('Không thể tải danh sách thuốc. Vui lòng thử lại sau.'));
      })
    );
  }
} 