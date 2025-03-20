import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MedicineService, Medicine } from '../../services/medicine.service';

@Component({
  selector: 'app-medicine',
  standalone: true, 
  imports: [CommonModule, RouterModule, FormsModule], 
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.css'],
})
export class MedicineComponent implements OnInit {
  searchTerm: string = '';
  medicines: Medicine[] = [];
  filteredMedicines: Medicine[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private router: Router, private medicineService: MedicineService) {}

  ngOnInit(): void {
    this.loadMedicines();
  }

  loadMedicines(): void {
    this.loading = true;
    this.medicineService.getAllMedicines().subscribe({
      next: (data) => {
        this.medicines = data;
        this.filteredMedicines = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Có lỗi xảy ra khi tải danh sách thuốc';
        this.loading = false;
        console.error('Error loading medicines:', error);
      }
    });
  }

  // Các khoảng giá để lọc
  priceRanges = [
    { label: 'Dưới 100.000đ', min: 0, max: 100000 },
    { label: '100.000đ - 300.000đ', min: 100000, max: 300000 },
    { label: '300.000đ - 500.000đ', min: 300000, max: 500000 },
    { label: 'Trên 500.000đ', min: 500000, max: Infinity },
  ];

  // Hàm định dạng giá theo kiểu Việt Nam (1.000.000đ)
  formatPrice(value: number | undefined): string {
    if (value === undefined || value === null) {
      return '0';
    }
    return value.toLocaleString('vi-VN');
  }

  // Lọc thuốc theo khoảng giá
  filterByPrice(range: any) {
    this.filteredMedicines = this.medicines.filter(
      (m) => m.price >= range.min && m.price <= range.max
    );
  }

  // Thêm vào giỏ hàng 
  addToCart(medicine: Medicine) {
    const cart = localStorage.getItem('cart');
    const cartItems = cart ? JSON.parse(cart) : [];

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItem = cartItems.find((item: any) => item.name === medicine.name);
    if (existingItem) {
      existingItem.quantity += 1; // Tăng số lượng nếu đã có
    } else {
      cartItems.push({ ...medicine, quantity: 1 }); // Thêm mới nếu chưa có
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));
    alert('Đã thêm vào giỏ hàng');
  }

  filterMedicines(): void {
    if (!this.searchTerm) {
      this.filteredMedicines = this.medicines;
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredMedicines = this.medicines.filter(medicine => 
      medicine.name.toLowerCase().includes(searchTermLower) ||
      medicine.description.toLowerCase().includes(searchTermLower) ||
      medicine.category.toLowerCase().includes(searchTermLower)
    );
  }
}