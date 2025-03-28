import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderDoctorComponent } from './header-doctor.component';

describe('HeaderDoctorComponent', () => {
  let component: HeaderDoctorComponent;
  let fixture: ComponentFixture<HeaderDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderDoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
