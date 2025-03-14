import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // Tải giỏ hàng từ localStorage
  loadCart(): void {
    const cart = localStorage.getItem('cart');
    this.cartItems = cart ? JSON.parse(cart) : [];
  }

  // Giảm số lượng sản phẩm
  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  }

  // Tăng số lượng sản phẩm
  increaseQuantity(index: number): void {
    this.cartItems[index].quantity++;
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  // Tính tổng tiền tạm tính
  getSubtotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  }

  // Tính phí vận chuyển
  getShippingFee(): number {
    // Có thể thay đổi logic tính phí ship ở đây
    return this.cartItems.length > 0 ? 30000 : 0;
  }

  // Tính tổng tiền của giỏ hàng
  getTotalPrice(): number {
    return this.getSubtotal() + this.getShippingFee();
  }

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  // Định dạng giá tiền (VNĐ)
  formatPrice(value: number): string {
    return value.toLocaleString('vi-VN') + 'đ';
  }

  // Xử lý thanh toán
  checkout(): void {
    if (this.cartItems.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }

    alert('Thanh toán thành công!');
    localStorage.removeItem('cart'); // Xóa giỏ hàng sau khi thanh toán
    this.cartItems = [];
    this.router.navigate(['/']); // Quay lại trang chủ
  }

  // Điều hướng quay lại trang mua hàng
  goToShop(): void {
    this.router.navigate(['medicine']);
  }
}