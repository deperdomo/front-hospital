import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';

import { CalendarComponent } from './calendar/calendar.component';
import { UserNavComponent } from "../../navs/user-nav/user-nav.component";
import { TitleJakartaComponent } from "../../navs/title-jakarta/title-jakarta.component";
import { Doctor } from '../../models/doctor';
import { IngresarDetallesCitaComponent } from "./ingresar-detalles-cita/ingresar-detalles-cita.component";
import { FechaCitaComponent } from "./fecha-cita/fecha-cita.component";



@Component({
  selector: 'app-patient-booking',
  imports: [CalendarComponent, UserNavComponent, TitleJakartaComponent, HttpClientModule, IngresarDetallesCitaComponent, FechaCitaComponent],
  templateUrl: './patient-booking.component.html',
  providers: [DoctorService]
})
export class PatientBookingComponent {
  doctorId: string = '';
  doctor: Doctor | null = null;
  isStep2: boolean = false;
  isFaltanDatos: boolean = false;

  selectedDateTime: Date | null = null;

  constructor(private doctorService: DoctorService, private route: ActivatedRoute) {}

  // Se ejecuta cuando se selecciona una fecha en el calendario
  onDateTimeSelected(dateTime: Date) {
    this.selectedDateTime = dateTime;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.doctorId = id;
        console.log('Doctor ID:', this.doctorId);
      } else {
        // Manejar el caso en el que el id sea null, si es necesario
        console.error('No se encontró el id del doctor en la URL');
      }
    });

    this.doctorService.getDoctorById(this.doctorId).subscribe(
      (doctor: Doctor) => {
        console.log('Doctor encontrado:', doctor);
        this.doctor = doctor;
      },
      error => {
        console.error('Error al buscar el doctor', error);
      }
    );
  }

    step2() {
    if (this.selectedDateTime) {
      this.isStep2 = true;
      this.isFaltanDatos = false;
    } else {
      this.isFaltanDatos = true;
    }
  }


  step2false() {
    this.isStep2 = false;
  }


}
