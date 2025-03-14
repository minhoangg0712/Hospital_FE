import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'

@Component({
  selector: 'app-home-patient',
  imports: [RouterModule],
  templateUrl: './home-patient.component.html',
  styleUrl: './home-patient.component.css'
})
export class HomePatientComponent {
  constructor(private router: Router) {}

  gotoPatient(){
    this.router.navigate(['/patient']);
  }
  
  goToMedicine() {
    this.router.navigate(['/medicine']);
  }

  goToAppointment() {
    this.router.navigate(['/appointment']);
  }


  goToCartComponent() {
    this.router.navigate(['/cart']);
  }
}