import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-medicine',
  standalone: true, // Sử dụng standalone component
  imports: [CommonModule, RouterModule], // ✅ Thêm RouterModule để điều hướng
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.css'],
})
export class MedicineComponent {
  constructor(private router: Router) {}

  medicines = [
    {
      id: 1,
      name: 'Aspirin Cardio',
      description: 'Chống kết tập tiểu cầu, phòng ngừa nhồi máu cơ tim.',
      price: 50000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/aspirin.png',
      tags: ['Tim mạch', 'Chống kết tập tiểu cầu'],
    },
    {
      id: 2,
      name: 'Atorvastatin (Lipitor)',
      description: 'Giảm cholesterol, phòng ngừa xơ vữa động mạch.',
      price: 75000,
      originalPrice: 100000,
      discount: true,
      image: '/assets/medicine/Lipitor.png',
      tags: ['Tim mạch', 'Giảm mỡ máu'],
    },
    {
      id: 3,
      name: 'Gabapentin (Neurontin)',
      description: 'Chống co giật hoặc động kinh, có tác dụng điều trị đau thần kinh.',
      price: 70000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/gabapentin.png',
      tags: ['Thần kinh', 'Động kinh'],
    },
    {
      id: 4,
      name: 'Diazepam (Valium)',
      description: 'An thần, giảm co giật, hỗ trợ điều trị lo âu.',
      price: 65000,
      originalPrice: 80000,
      discount: true,
      image: '/assets/medicine/Valium.png',
      tags: ['Thần kinh', 'An thần'],
    },
    {
      id: 5,
      name: 'Metformin (Glucophage)',
      description: 'Điều trị tiểu đường type 2.',
      price: 120000,
      originalPrice: 150000,
      discount: true,
      image: '/assets/medicine/glucophage.png',
      tags: ['Nội tiết', 'Tiểu đường'],
    },
    {
      id: 6,
      name: 'Levothyroxine (Euthyrox)',
      description: 'Điều trị suy giáp.',
      price: 180000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/Euthyrox.png',
      tags: ['Nội tiết', 'Suy giáp'],
    },
    {
      id: 7,
      name: 'Amoxicillin-Clavulanate (Augmentin)',
      description: 'Kháng sinh phổ rộng, điều trị nhiễm khuẩn.',
      price: 450000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/augmentin.png',
      tags: ['Kháng sinh', 'Nhiễm khuẩn'],
    },
    {
      id: 8,
      name: 'Oseltamivir (Tamiflu)',
      description: 'Điều trị cúm A, cúm B.',
      price: 95000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/tamiflu.png',
      tags: ['Kháng virus', 'Cúm'],
    },
    {
      id: 9,
      name: 'Salbutamol (Ventolin)',
      description: 'Giãn phế quản, điều trị hen suyễn, COPD.',
      price: 80000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/Ventolin.png',
      tags: ['Hô hấp', 'Hen suyễn', 'Dạng xịt'],
    },
    {
      id: 10,
      name: 'Montelukast (Singulair)',
      description: 'Điều trị viêm mũi dị ứng, hen phế quản.',
      price: 145000,
      originalPrice: 150000,
      discount: true,
      image: '/assets/medicine/Singulair.png',
      tags: ['Hô hấp', 'Viêm mũi dị ứng', 'Dạng cốm uống'],
    },
    {
      id: 11,
      name: 'Celecoxib (Celebrex)',
      description: 'Giảm đau, kháng viêm, điều trị viêm khớp.',
      price: 60000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/celebrex.png',
      tags: ['Cơ xương khớp', 'Kháng viêm', 'Giảm đau'],
    },
    {
      id: 12,
      name: 'Alendronate (Fosamax Plus)',
      description: 'Điều trị loãng xương, phòng gãy xương.',
      price: 155000,
      originalPrice: 180000,
      discount: true,
      image: '/assets/medicine/Fosamax.png',
      tags: ['Cơ xương khớp', 'Loãng xương'],
    },
    {
      id: 13,
      name: 'Tobramycin (Tobrex)',
      description: 'Kháng sinh nhỏ mắt, điều trị viêm nhiễm mắt.',
      price: 49000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/tobramycin.png',
      tags: ['Nhãn khoa', 'Viêm mắt', 'Dạng thuốc nhỏ mắt'],
    },
    {
      id: 14,
      name: 'Brimonidine (Alphagan)',
      description: 'Điều trị tăng nhãn áp, hạ nhãn áp.',
      price: 72000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/alphagan.png',
      tags: ['Nhãn khoa', 'Tăng nhãn áp', 'Dạng thuốc nhỏ mắt'],
    },
    {
      id: 15,
      name: 'Novadex (Tamoxifen)',
      description: 'Điều trị ung thư vú phụ thuộc hormone.',
      price: 850000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/Nolvadex.png',
      tags: ['Ung bướu', 'Ung thư vú'],
    },
    {
      id: 16,
      name: 'Omeprazole (Losec)',
      description: 'Điều trị viêm loét dạ dày, trào ngược thực quản.',
      price: 32000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/omeprazole.png',
      tags: ['Ợ chua', 'Viêm loét dạ dày'],
    },
    {
      id: 17,
      name: 'Ranitidine (Zantac)',
      description: 'Giảm tiết acid dạ dày, hỗ trợ điều trị viêm loét.',
      price: 280000,
      originalPrice: 320000,
      discount: true,
      image: '/assets/medicine/ranitidin.png',
      tags: ['Khó tiêu', 'Loét dạ dày tá tràng', 'Trào ngược dạ dày'],
    },
    {
      id: 18,
      name: 'Co-Diovan (Hydrochlorothiazide)',
      description: 'Thuốc lợi tiểu, điều trị tăng huyết áp.',
      price: 150000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/Diovan.png',
      tags: ['Tim mạch', 'Tăng huyết áp', 'Thuốc lợi tiểu'],
    },
    {
      id: 19,
      name: 'Warfarin',
      description: 'Chống đông máu, phòng ngừa huyết khối.',
      price: 96000,
      originalPrice: 100000,
      discount: true,
      image: '/assets/medicine/warfarin.png',
      tags: ['Tim mạch', 'Chống đông máu'],
    },
    {
      id: 20,
      name: 'Ivermectin',
      description: 'Điều trị nhiễm ký sinh trùng, giun sán.',
      price: 98000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/iver.png',
      tags: ['Ký sinh trùng', 'Nhiễm giun sán'],
    },
    {
      id: 21,
      name: 'Plavix (Clopidogrel)',
      description: 'Giảm nguy cơ thành lập máu đông, huyết khối.',
      price: 155000,
      originalPrice: 160000,
      discount: true,
      image: '/assets/medicine/plavix.png',
      tags: ['Xơ vữa động mạch', 'Phòng đột quỵ'],
    },
    {
      id: 22,
      name: 'Methotrexate Belmed',
      description: 'Điều trị viêm khớp dạng thấp, vảy nến.',
      price: 97000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/methot.png',
      tags: ['Vảy nến', 'Viêm khớp dạng thấp'],
    },
    {
      id: 23,
      name: 'Lyrica (Pregabalin)',
      description: 'Điều trị đau thần kinh, động kinh cục bộ.',
      price: 78000,
      originalPrice: 85000,
      discount: true,
      image: '/assets/medicine/lyrica.png',
      tags: ['Động kinh', 'Đau thần kinh toạ', 'Lo âu'],
    },
    {
      id: 24,
      name: 'Diflucan (Fluconazole)',
      description: 'Điều trị nhiễm nấm miệng, nấm âm đạo.',
      price: 240000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/diflucan.png',
      tags: ['Nấm', 'Nhiễm trùng nấm'],
    },
    {
      id: 25,
      name: 'Enoxaparin (Lovenox)',
      description: 'Thuyên tắc huyết khối tĩnh mạch.',
      price: 700000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/lovenox.png',
      tags: ['Đau thắt ngực', 'Chống huyết khối', 'Dung dịch tiêm'],
    },
    {
      id: 26,
      name: 'Tacrolimus (Prograf)',
      description: 'Ngăn đào thải sau ghép nội tạng.',
      price: 1200000,
      originalPrice: 1250000,
      discount: true,
      image: '/assets/medicine/prograf.png',
      tags: ['Miễn dịch', 'Ghép tạng'],
    },
    {
      id: 27,
      name: 'Avastin (Bevacizumab)',
      description: 'Điều trị ung thư đại, trực tràng di căn.',
      price: 850000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/avastin.png',
      tags: ['Ung thư'],
    },
    {
      id: 28,
      name: 'Atilene (Alimemazin tartrat)',
      description: 'Điều trị các bệnh hô hấp, viêm mũi, hắt hơi, sổ mũi.',
      price: 34000,
      originalPrice: 50000,
      discount: true,
      image: '/assets/medicine/atilene.png',
      tags: ['Hô hấp', 'Viêm mũi', 'Hắt hơi', 'Sổ mũi', 'Siro uống'],
    },
    {
      id: 29,
      name: 'Herceptin (Trastuzumab)',
      description: 'Điều trị ung thư vú sớm, ung thư vú tiến triển, ung thư dạ dày tiến triển.',
      price: 1500000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/herceptin.png',
      tags: ['Ung thư vú', 'Ung thư dạ dày', 'Dung dịch'],
    },
    {
      id: 30,
      name: 'Crestor (Rosuvastatin)',
      description: 'Điều trị tăng cholesterol máu nguyên phát hoặc rối loạn lipid máu hỗn hợp.',
      price: 145000,
      originalPrice: 160000,
      discount: true,
      image: '/assets/medicine/crestor.png',
      tags: ['Mỡ máu', 'Cholesterol', 'Xơ vữa động mạch'],
    },
    {
      id: 31,
      name: 'Aricept (Donepezil)',
      description: 'Điều trị bệnh Alzheimer và suy giảm trí nhớ.',
      price: 235000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/aricept.png',
      tags: ['Thần kinh', 'Alzheimer'],
    },
    {
      id: 32,
      name: 'Allopurinol Domesco',
      description: 'Điều trị tăng acid uric máu, sỏi thận.',
      price: 45000,
      originalPrice: 50000,
      discount: true,
      image: '/assets/medicine/allopurinol.png',
      tags: ['Acid Uric máu', 'Sỏi thận'],
    },
    {
      id: 33,
      name: 'Alisha Biotic For Women Happy Life',
      description: 'Bổ sung lợi khuẩn, hỗ trợ sức khoẻ nữ giới.',
      price: 230000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/Alisha.png',
      tags: ['Sinh lý', 'Nội tiết tố'],
    },
    {
      id: 34,
      name: 'Arcoxia (Etoricoxib)',
      description: 'Điều trị cấp tính và mãn tính triệu chứng viêm xương khớp.',
      price: 180000,
      originalPrice: 200000,
      discount: true,
      image: '/assets/medicine/arcoxia.png',
      tags: ['Kháng viêm', 'Giảm đau', 'Viêm xương khớp'],
    },
    {
      id: 35,
      name: 'Forxiga AstraZeneca',
      description: 'Điều trị đái tháo đường tuýp 2, suy tim, bệnh thận mạn.',
      price: 325000,
      originalPrice: 350000,
      discount: true,
      image: '/assets/medicine/forxiga.png',
      tags: ['Đái tháo đường', 'Suy tim', 'Bệnh thận'],
    },
    {
      id: 36,
      name: 'Xarelto (Rivaroxaban)',
      description: 'Phòng ngừa thuyên tắc huyết khối tĩnh mạch, điều trị và dự phòng huyết khối tĩnh mạch sâu.',
      price: 720000,
      originalPrice: 750000,
      discount: true,
      image: '/assets/medicine/xarelto.png',
      tags: ['Tim mạch', 'Chống đông máu'],
    },
    {
      id: 37,
      name: 'Viên sủi Berocca Bayer',
      description: 'Bổ sung vitamin và khoáng chất.',
      price: 75000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/berocca.png',
      tags: ['Thuốc bổ', 'Viên sủi'],
    },
    {
      id: 38,
      name: 'Cốm Nexium (Esomeprazole)',
      description: 'Điều trị trào ngược dạ dày - thực quản (28 gói).',
      price: 130000,
      originalPrice: 150000,
      discount: true,
      image: '/assets/medicine/Nexium.png',
      tags: ['Loét dạ dày tá tràng', 'Trào ngược dạ dày'],
    },
    {
      id: 39,
      name: 'Thuốc bột pha hỗn dịch uống Smecta ',
      description: 'Điều trị tiêu chảy (30 gói).',
      price: 80000,
      originalPrice: 0,
      discount: false,
      image: '/assets/medicine/smecta.png',
      tags: ['Thuốc bột pha', 'Trị tiêu chảy'],
    },
  ];

  // Sao chép danh sách thuốc để lọc
  filteredMedicines = [...this.medicines];

  // Các khoảng giá để lọc
  priceRanges = [
    { label: 'Dưới 100.000đ', min: 0, max: 100000 },
    { label: '100.000đ - 300.000đ', min: 100000, max: 300000 },
    { label: '300.000đ - 500.000đ', min: 300000, max: 500000 },
    { label: 'Trên 500.000đ', min: 500000, max: Infinity },
  ];

  // Hàm định dạng giá theo kiểu Việt Nam (1.000.000đ)
  formatPrice(value: number): string {
    return value.toLocaleString('vi-VN') ;
  }

  // Lọc thuốc theo khoảng giá
  filterByPrice(range: any) {
    this.filteredMedicines = this.medicines.filter(
      (m) => m.price >= range.min && m.price <= range.max
    );
  }

  // Thêm vào giỏ hàng 
addToCart(medicine: any) {
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
}