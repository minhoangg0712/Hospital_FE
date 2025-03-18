import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-prescription-management',
  templateUrl: './prescription-management.component.html',
  styleUrls: ['./prescription-management.component.css'],
  imports: [CommonModule, FormsModule] 
})
export class PrescriptionManagementComponent {
  prescriptions = [
    { id: 1, name: 'Paracetamol', dosage: '500mg', quantity: 20, usage: 'Uống sau khi ăn' },
    { id: 2, name: 'Amoxicillin', dosage: '250mg', quantity: 10, usage: 'Uống trước bữa ăn' }
  ];

  newPrescription = { id: 0, name: '', dosage: '', quantity: 0, usage: '' };
  editIndex: number | null = null;

  // Thêm hoặc cập nhật đơn thuốc
  savePrescription() {
    if (!this.newPrescription.name || !this.newPrescription.dosage || this.newPrescription.quantity <= 0) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (this.editIndex === null) {
      this.newPrescription.id = this.prescriptions.length + 1;
      this.prescriptions.push({ ...this.newPrescription });
    } else {
      this.prescriptions[this.editIndex] = { ...this.newPrescription };
      this.editIndex = null;
    }

    this.resetForm();
  }

  // Chỉnh sửa đơn thuốc
  editPrescription(index: number) {
    this.newPrescription = { ...this.prescriptions[index] };
    this.editIndex = index;
  }

  // Xóa đơn thuốc
  deletePrescription(index: number) {
    this.prescriptions.splice(index, 1);
    if (this.editIndex === index) {
      this.cancelEdit();
    }
  }

  // Hủy chỉnh sửa
  cancelEdit() {
    this.editIndex = null;
    this.resetForm();
  }

  // Reset form
  resetForm() {
    this.newPrescription = { id: 0, name: '', dosage: '', quantity: 0, usage: '' };
  }
}
