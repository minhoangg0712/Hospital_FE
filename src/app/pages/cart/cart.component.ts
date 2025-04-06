import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { MedicineService, Medicine } from '../../services/medicine.service';

interface CartItem {
  cartItemId: number;
  medicineId: number;
  medicineName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

interface CartResponse {
  items: CartItem[];
  summary: {
    subtotal: number;
    shippingFee: number;
    total: number;
  };
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  medicineDetails: Map<number, Medicine> = new Map();
  isLoggedIn: boolean = false;
  loading: boolean = true;
  error: string | null = null;
  cartSummary = {
    subtotal: 0,
    shippingFee: 30000,
    total: 0
  };

  constructor(
    private router: Router,
    private cartService: CartService,
    private medicineService: MedicineService
  ) {
    this.checkLoginStatus();
  }

  private checkLoginStatus(): void {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    this.isLoggedIn = !!token && !!userId;
    
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    if (this.isLoggedIn) {
      this.loadCart();
    }
  }

  loadCart(): void {
    this.loading = true;
    this.error = null;
    
    this.cartService.getCartItems().subscribe({
      next: (response: any) => {
        console.log('Dữ liệu giỏ hàng:', response);
        
        // Kiểm tra và gán dữ liệu
        if (response && Array.isArray(response.items)) {
          this.cartItems = response.items;
          this.cartSummary = response.summary || this.cartSummary;
          this.loadMedicineDetails();
        } else if (Array.isArray(response)) {
          // Nếu response là một mảng trực tiếp
          this.cartItems = response;
          this.updateCartSummary();
        } else {
          console.error('Dữ liệu giỏ hàng không hợp lệ:', response);
          this.error = 'Không thể tải dữ liệu giỏ hàng';
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải giỏ hàng:', error);
        this.error = error.message || 'Có lỗi xảy ra khi tải giỏ hàng';
        this.loading = false;
        
        if (error.message?.includes('Phiên đăng nhập đã hết hạn')) {
          this.isLoggedIn = false;
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  private updateCartSummary(): void {
    this.cartSummary.subtotal = this.cartItems.reduce((total, item) => 
      total + (item.unitPrice * item.quantity), 0);
    this.cartSummary.total = this.cartSummary.subtotal + this.cartSummary.shippingFee;
  }

  loadMedicineDetails(): void {
    if (!Array.isArray(this.cartItems) || this.cartItems.length === 0) {
      return;
    }

    this.medicineService.getAllMedicines().subscribe({
      next: (medicines) => {
        this.cartItems.forEach(item => {
          const medicine = medicines.find(m => m.medicineId === item.medicineId);
          if (medicine) {
            this.medicineDetails.set(item.medicineId, medicine);
          }
        });
      },
      error: (error) => {
        console.error('Lỗi khi tải thông tin thuốc:', error);
        this.error = 'Không thể tải thông tin chi tiết sản phẩm';
      }
    });
  }

  // Phương thức xử lý đường dẫn ảnh
  getImageUrl(medicine: Medicine | undefined): string {
    if (!medicine?.imageUrl) {
      return 'https://via.placeholder.com/80x80.png?text=Thuốc';
    }
    // Nếu imageUrl đã là đường dẫn đầy đủ (bắt đầu bằng http hoặc https)
    if (medicine.imageUrl.startsWith('http://') || medicine.imageUrl.startsWith('https://')) {
      return medicine.imageUrl;
    }
    // Nếu imageUrl là đường dẫn tương đối, thêm base URL
    return `./assets/${medicine.imageUrl}`;
  }

  decreaseQuantity(cartItemId: number, currentQuantity: number): void {
    if (currentQuantity > 1) {
      this.cartService.updateQuantity(cartItemId, currentQuantity - 1).subscribe({
        next: (response: any) => {
          console.log('Cập nhật số lượng thành công:', response);
          if (response.items) {
            this.cartItems = response.items;
            this.cartSummary = response.summary;
          } else {
            const index = this.cartItems.findIndex(item => item.cartItemId === cartItemId);
            if (index !== -1) {
              this.cartItems[index].quantity = currentQuantity - 1;
              this.updateCartSummary();
            }
          }
        },
        error: (error) => {
          console.error('Lỗi khi cập nhật số lượng:', error);
          alert(error.message || 'Có lỗi xảy ra khi cập nhật số lượng!');
        }
      });
    }
  }

  increaseQuantity(cartItemId: number, currentQuantity: number): void {
    this.cartService.updateQuantity(cartItemId, currentQuantity + 1).subscribe({
      next: (response: any) => {
        console.log('Cập nhật số lượng thành công:', response);
        if (response.items) {
          this.cartItems = response.items;
          this.cartSummary = response.summary;
        } else {
          const index = this.cartItems.findIndex(item => item.cartItemId === cartItemId);
          if (index !== -1) {
            this.cartItems[index].quantity = currentQuantity + 1;
            this.updateCartSummary();
          }
        }
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật số lượng:', error);
        alert(error.message || 'Có lỗi xảy ra khi cập nhật số lượng!');
      }
    });
  }

  removeFromCart(cartItemId: number): void {
    this.cartService.removeFromCart(cartItemId).subscribe({
      next: (response: any) => {
        console.log('Xóa sản phẩm thành công');
        if (response && response.items) {
          this.cartItems = response.items;
          this.cartSummary = response.summary;
        } else {
          this.cartItems = this.cartItems.filter(item => item.cartItemId !== cartItemId);
          this.updateCartSummary();
        }
      },
      error: (error) => {
        console.error('Lỗi khi xóa sản phẩm:', error);
        alert(error.message || 'Có lỗi xảy ra khi xóa sản phẩm!');
      }
    });
  }

  formatPrice(value: number): string {
    return value.toLocaleString('vi-VN') + 'đ';
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }

    alert('Thanh toán thành công!');
    this.cartItems = [];
    this.medicineDetails.clear();
    this.cartSummary = {
      subtotal: 0,
      shippingFee: 30000,
      total: 0
    };
    this.router.navigate(['/']);
  }

  goToShop(): void {
    this.router.navigate(['medicine']);
  }

  getMedicineInfo(medicineId: number): Medicine | undefined {
    return this.medicineDetails.get(medicineId);
  }
}