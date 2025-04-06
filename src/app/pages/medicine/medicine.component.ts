import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MedicineService, Medicine } from '../../services/medicine.service';
import { CartService } from '../../services/cart.service';

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
  isLoggedIn: boolean = false;

  constructor(
    private router: Router, 
    private medicineService: MedicineService,
    private cartService: CartService
  ) {
    // Kiểm tra trạng thái đăng nhập
    this.isLoggedIn = !!localStorage.getItem('token') && !!localStorage.getItem('userId');
  }

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
        console.log('>>> Dữ liệu thuốc trả về từ API:', data); 
      },
      error: (error) => {
        this.error = 'Có lỗi xảy ra khi tải danh sách thuốc';
        this.loading = false;
        console.error('Error loading medicines:', error);
      }
    });
  }

  // Phương thức xử lý đường dẫn ảnh
  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) {
      return 'https://via.placeholder.com/150x150.png?text=Thuốc';
    }
    
    // Nếu imageUrl đã là đường dẫn đầy đủ (bắt đầu bằng http hoặc https)
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      // Xử lý đường dẫn Google Drive
      if (imageUrl.includes('drive.google.com')) {
        // Lấy ID của file từ đường dẫn Google Drive
        const fileId = imageUrl.match(/\/d\/(.*?)\/view/)?.[1];
        if (fileId) {
          // Chuyển đổi sang đường dẫn trực tiếp
          const directLink = `https://drive.google.com/uc?export=view&id=${fileId}`;
          console.log('>>> Đường dẫn chuyển đổi từ Drive:', directLink); // 👈 Log link chuyển đổi
          return directLink;
        }
      }
      return imageUrl;
    }
    
    // Nếu imageUrl là đường dẫn từ database, thêm URL của API
    return `http://localhost:8080${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
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
      (m) => m.unitPrice >= range.min && m.unitPrice <= range.max
    );
  }

  // Thêm vào giỏ hàng 
  addToCart(medicine: Medicine) {
    if (!this.isLoggedIn) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      this.router.navigate(['/login']);
      return;
    }

    if (!medicine || !medicine.medicineId) {
      console.error('Dữ liệu sản phẩm không hợp lệ:', medicine);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng!');
      return;
    }

    try {
      console.log('Đang thêm sản phẩm vào giỏ hàng:', medicine);
      this.cartService.addToCart(medicine.medicineId, 1).subscribe({
        next: (response) => {
          console.log('Thêm vào giỏ hàng thành công:', response);
          alert('Đã thêm vào giỏ hàng thành công!');
        },
        error: (error) => {
          console.error('Lỗi khi thêm vào giỏ hàng:', error);
          if (error.message === 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!') {
            this.isLoggedIn = false;
            alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
            this.router.navigate(['/login']);
          } else if (error.message === 'Bạn không có quyền thực hiện thao tác này!') {
            alert('Bạn không có quyền thêm vào giỏ hàng!');
          } else {
            alert(error.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng!');
          }
        }
      });
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng!');
    }
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
      (medicine.category?.toLowerCase().includes(searchTermLower) ?? false)
    );
  }
}