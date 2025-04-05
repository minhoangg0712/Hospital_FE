import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-doctor',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home-doctor.component.html',
  styleUrls: ['./home-doctor.component.css']  
})
export class HomeDoctorComponent {
  constructor(private router: Router) { }

  goToSchedule(): void {
    this.router.navigate(['/doctor/schedule']);
  }
  
  GoToMedicalRecords(): void {
    this.router.navigate(['/doctor/medical-records']);
  }
  
  GoToRecordsList(): void {
    this.router.navigate(['/doctor/records-list']);
  }
  
  GoToPrescriptionManagement(): void {
    this.router.navigate(['/doctor/prescription-management']);
  }
}
