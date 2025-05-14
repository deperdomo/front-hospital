import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { HistorialMedicoService } from '../../services/historialMedico';
import { HistorialMedico } from '../../models/historialMedico';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { FormsModule } from '@angular/forms';
import { Cita } from '../../models/cita';
import { CitaService } from '../../services/cita.service';
import { RecetaService } from '../../services/receta.service';

@Component({
  selector: 'app-formulario-historial-medico',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './formulario-historial-medico.component.html',
  styleUrl: './formulario-historial-medico.component.css',
  providers: [HistorialMedicoService, UsuarioService, CitaService, RecetaService]
})
export class FormularioHistorialMedicoComponent implements OnInit {
  usuario: Usuario;
  historialMedico: HistorialMedico;
  cita: Cita;
  recetaExistente: boolean = false;

  constructor(
    private historialMedicoService: HistorialMedicoService,
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private citaSerice: CitaService,
    private recetaService: RecetaService
  ) {
    this.usuario = {} as Usuario;
    this.cita = {} as Cita;
    this.historialMedico = {
      id: 0,
      tratamiento: '',
      fecha: '',
      diagnostico: '',
      usuario: {} as Usuario
    } as HistorialMedico;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idUsuario = params.get('id');
      const idCita = params.get('idCita');
      console.log("COMPROBACION ID capturado:", idUsuario);
      console.log("Hola");
      console.log("comprobanco id de cita ", idCita);

      if (idUsuario && idCita) {
        console.log("id de la cita ", idCita);
        this.citaSerice.getCita(idCita).subscribe(
          (cita: Cita) => {
            this.cita = cita;
            this.comprobacionRecetaExistente(this.cita.id);
          },
          (error) => {
            console.error("Error al obtener la cita:", error);
          }
        );
        this.usuarioService.buscarUsuario(idUsuario).subscribe(
          (usuario: Usuario) => {
            console.log("Usuario encontrado:", usuario);
            this.usuario = usuario;
            console.log(typeof usuario.id);
          },
          (error) => {
            console.error("Error al buscar usuario:", error);
          }
        );
      } else {
        console.log("No se encontró un ID en la URL.");
      }
    });
  }

  crearHistorial(idUsuario: number, idCita: number) {
    console.log(idUsuario);
    console.log("comprobadno el id de la cita en el metodode creraHistorial", idCita);
    if (idUsuario) {
      console.log("comprobando", this.historialMedico);
      this.historialMedicoService.crearHistorialMedico(idUsuario.toString(), this.historialMedico).subscribe(
        (historial) => {
          console.log("comprobando el id que envio", idUsuario);
          console.log("Historial de alta  encontrado:", historial);
          if (this.usuario.id != null && historial && this.historialMedico.id != null) {
            console.log("ID de usuario válido, creando historial...");
            this.redireccionAltaReceta(this.usuario.id, historial.id, idCita);
            console.log(this.usuario.id);
            console.log(this.historialMedico.id);
            console.log(this.cita.id);
          }
        },
        (error) => {
          console.error("Error al crear historial:", error);
        }
      );
    }
  }

  redireccionAltaReceta(idUsuario: number, idHistorialMedico: number, idCita: number) {
    console.log("COMPROBACION DE LOS VALERES DE LA URL");
    console.log("idUSUARIO", idUsuario);
    console.log("idHistorialMedico", idHistorialMedico);
    console.log("idCita", idCita);
    console.log("Redirigiendo a formularioReceta con datos:", idHistorialMedico, idUsuario);
    this.router.navigate(['/formularioReceta', idUsuario, idCita, idHistorialMedico]);
    console.log(typeof idUsuario);
    console.log(typeof idCita);
    console.log(typeof idHistorialMedico);
    console.log("URL idUsuario", idUsuario);
    console.log("URL idCita", idCita);
    console.log("URL idHistorialMedico", idHistorialMedico);
  }

  navigateToProfile() {
    this.router.navigate(['/indexDoctores']);
  }

  comprobacionRecetaExistente(idCita: number) {
    console.log(`Comprobando si existe receta para la cita ID: ${idCita}`);
  
    this.recetaService.obtenerCitaReceta(idCita.toString()).subscribe(
      (existeReceta: boolean) => { 
        console.log("Respuesta del backend (booleano):", existeReceta);
        this.recetaExistente = existeReceta; 
      },
      error => {
        console.error("Error al verificar receta:", error);
        this.recetaExistente = false; // si hay error no hay receta
      }
    );
  }
  
}