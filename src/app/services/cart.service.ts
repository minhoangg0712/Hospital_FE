import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface CartItem {
  cartItemId: number;
  medicineId: number;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/cart';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Vui lòng đăng nhập để thực hiện thao tác này!');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private handleError(error: any) {
    console.error('Lỗi từ server:', error);
    
    // Xử lý lỗi 401 (Unauthorized)
    if (error.status === 401) {
      return throwError(() => new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!'));
    }
    
    // Xử lý lỗi 403 (Forbidden)
    if (error.status === 403) {
      return throwError(() => new Error('Bạn không có quyền thực hiện thao tác này!'));
    }

    // Xử lý lỗi 400 (Bad Request)
    if (error.status === 400) {
      const errorMessage = error.error?.message || 'Dữ liệu không hợp lệ. Vui lòng thử lại!';
      return throwError(() => new Error(errorMessage));
    }

    // Xử lý lỗi 404 (Not Found)
    if (error.status === 404) {
      return throwError(() => new Error('Không tìm thấy tài nguyên yêu cầu!'));
    }

    // Xử lý lỗi 500 (Internal Server Error)
    if (error.status === 500) {
      return throwError(() => new Error('Lỗi hệ thống. Vui lòng thử lại sau!'));
    }

    // Xử lý lỗi kết nối
    if (error.status === 0) {
      return throwError(() => new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!'));
    }

    // Xử lý lỗi khác
    return throwError(() => new Error(error.error?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.'));
  }

  // Lấy tất cả sản phẩm trong giỏ hàng
  getCartItems(): Observable<CartItem[]> {
    try {
      return this.http.get<CartItem[]>(this.apiUrl, { 
        headers: this.getHeaders(),
        withCredentials: true
      }).pipe(
        catchError(this.handleError)
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(medicineId: number, quantity: number): Observable<CartItem> {
    try {
      if (!medicineId || !quantity) {
        throw new Error('Dữ liệu sản phẩm không hợp lệ');
      }

      const params = new HttpParams()
        .set('medicineId', medicineId.toString())
        .set('quantity', quantity.toString());

      return this.http.post<CartItem>(`${this.apiUrl}/add`, null, { 
        headers: this.getHeaders(),
        params: params,
        withCredentials: true
      }).pipe(
        catchError(this.handleError)
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateQuantity(cartItemId: number, quantity: number): Observable<CartItem> {
    try {
      if (!cartItemId || !quantity) {
        throw new Error('Dữ liệu cập nhật không hợp lệ');
      }

      const params = new HttpParams()
        .set('quantity', quantity.toString());

      return this.http.put<CartItem>(`${this.apiUrl}/${cartItemId}`, null, { 
        headers: this.getHeaders(),
        params: params,
        withCredentials: true
      }).pipe(
        catchError(this.handleError)
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart(cartItemId: number): Observable<void> {
    try {
      if (!cartItemId) {
        throw new Error('ID sản phẩm không hợp lệ');
      }

      return this.http.delete<void>(`${this.apiUrl}/${cartItemId}`, { 
        headers: this.getHeaders(),
        withCredentials: true
      }).pipe(
        catchError(this.handleError)
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Xóa toàn bộ giỏ hàng
  clearCart(): Observable<void> {
    try {
      return this.http.delete<void>(`${this.apiUrl}/clear`, { 
        headers: this.getHeaders(),
        withCredentials: true
      }).pipe(
        catchError(this.handleError)
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Lấy thông tin chi tiết của thuốc
  getMedicineDetails(medicineId: number): Observable<any> {
    return this.http.get(`http://localhost:8080/api/medicine/${medicineId}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }
} 