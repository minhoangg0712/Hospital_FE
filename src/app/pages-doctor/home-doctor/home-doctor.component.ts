import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-doctor',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home-doctor.component.html',
  styleUrls: ['./home-doctor.component.css']  // Sửa từ styleUrl thành styleUrls
})
export class HomeDoctorComponent {
  constructor(private router: Router) { }

  goToSchedule(): void {
    this.router.navigate(['/doctor/schedule']);
  }
  GoToMedicalRecords(): void {
    this.router.navigate(['/create-medical-record']);
  }
  GoToRecordsList(): void {
    this.router.navigate(['/medical-records']);
  }
  GoToPrescriptionManagement(): void {
    this.router.navigate(['/prescription-management']);
  }
}
