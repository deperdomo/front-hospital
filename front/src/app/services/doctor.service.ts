import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Doctor } from '../models/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private apiUrl = 'http://localhost:8090/doctor'; // URL del endpoint

  constructor(private http: HttpClient) { }

  altaDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.apiUrl}/alta`, doctor);
  }

  getXDoctors(cantidad: number): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/recomendado/${cantidad}`);
  }

  getDoctorById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/one/${id}`);
  }

  getTodosDoctores(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/allDoctors`);
  }

  buscarPorNombreApellidoLocalidadYEspecialidad(nombre: string, apellido: string, localidad: string, especialidad: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/porNombreApellidoLocalidadYEspecialidad/${nombre}/${apellido}/${localidad}/${especialidad}`)
      .pipe(
        catchError(error => {
          console.error('Datos erróneos introducidos:', error);

          return of([]);
        })
      );
  }

  buscarPorLocalidad(localidad: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/localidad/${localidad}`);
  }

  votarDoctor(idDoctor: number, valoracion: boolean): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/votar/${idDoctor}/${valoracion}`, null);
  }

  //editar
  editarDoctor(doctor: Doctor): Observable<Doctor> {
      return this.http.put<Doctor>(`${this.apiUrl}/editar`, doctor);
    }
//cambio de password
    editarPassword(id: string, password:string): Observable<Doctor> {
        
        return this.http.put<Doctor>(`${this.apiUrl}/password/${id}`,password);
      }
}
