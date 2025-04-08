import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface CartItem {
  cartItemId: number;
  medicineId: number;
  quantity: number;
  price: number;
}

interface CartResponse {
  items: CartItem[];
  summary: {
    subtotal: number;
    shippingFee: number;
    total: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/cart';
  private paymentStatusSubject = new BehaviorSubject<boolean>(false);
  paymentStatus$ = this.paymentStatusSubject.asObservable();

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
      // Kiểm tra xem có thông báo lỗi cụ thể từ server không
      if (error.error && error.error.message) {
        return throwError(() => new Error(error.error.message));
      }
      
      // Kiểm tra xem có phải là lỗi thanh toán không
      if (error.url && error.url.includes('/checkout')) {
        return throwError(() => new Error('Không thể thanh toán. Vui lòng kiểm tra lại giỏ hàng của bạn!'));
      }
      
      return throwError(() => new Error('Dữ liệu không hợp lệ. Vui lòng thử lại!'));
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
  getCartItems(): Observable<CartResponse> {
    try {
      return this.http.get<CartResponse>(this.apiUrl, { 
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

  checkout(): Observable<void> {
    try {
      // Kiểm tra token
      const token = localStorage.getItem('token');
      if (!token) {
        return throwError(() => new Error('Vui lòng đăng nhập để thực hiện thanh toán!'));
      }

      // Kiểm tra quyền truy cập
      const userRole = localStorage.getItem('userRole');
      if (userRole !== 'EMP' && userRole !== 'MGR') {
        return throwError(() => new Error('Bạn không có quyền thực hiện thanh toán!'));
      }

      return this.http.post<void>(`${this.apiUrl}/checkout`, null, { 
        headers: this.getHeaders(),
        withCredentials: true
      }).pipe(
        catchError(this.handleError)
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Cập nhật trạng thái thanh toán
  updatePaymentStatus(status: boolean) {
    this.paymentStatusSubject.next(status);
  }

  // Lấy thông tin chi tiết của thuốc
  getMedicineDetails(medicineId: number): Observable<any> {
    return this.http.get(`http://localhost:8080/api/medicine/${medicineId}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }
} 