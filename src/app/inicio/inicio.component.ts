import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AudioRecordingService, RecordedBlob } from '../services/audio-recording.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, OnDestroy {
  usernameControl = this.fb.control('', [Validators.required]);
  audioBlob: Blob | null = null;
  audioUrl: SafeUrl | null = null;
  isRecording = false;

  oracion: string | null = null; // Nueva variable para almacenar la oración
  private userId: string | null = null; // Nueva variable para almacenar el userId
  
  private audioRecordingSubscription: Subscription | null = null;
  router: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private audioRecordingService: AudioRecordingService
  ) {}

  ngOnInit(): void {
    // Suscribirse al observable para obtener el audio grabado
    this.audioRecordingSubscription = this.audioRecordingService.getRecordedBlob()
      .subscribe((recorded: RecordedBlob) => {
        this.audioBlob = recorded.blob;
        this.audioUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.audioBlob));
      });
  }

  ngOnDestroy(): void {
    this.audioRecordingSubscription?.unsubscribe();
  }

  startRecording(): void {
    this.isRecording = true;
    this.audioRecordingService.startRecording();
  }

  stopRecording(): void {
    this.isRecording = false;
    this.audioRecordingService.stopRecording();
  }

  navigateToRegister() {
    this.router.navigate(['/register']); // Asegúrate de que la ruta '/register' esté configurada en tu enrutador
  }

  // ----------------------------- FUNCIONES PARA EL COMUNICARSE --------------------------------------
  login(): void {
    if (!this.usernameControl.valid) {
      alert("Por favor, ingresa un nombre de usuario.");
      return;
    }

    const username = this.usernameControl.value;

    // Crear un nuevo FormData
    const formData = new FormData();
    formData.append('username', username); // Añadir el nombre de usuario

    // Llamar al servicio de autenticación
    this.authService.loginUsername(formData).subscribe(
      response => {
        if (response.oracion) {
          this.oracion = response.oracion; // Almacena la oración en la variable

          alert("Oración para validar: " + this.oracion);
        } else {
          alert("No se pudo obtener la oración.");
        }
      },
      error => alert("Error en el inicio de sesión: " + error.error)
    );
  }

  // Función para validar la voz
  validateVoice(): void {
    if (!this.audioBlob) {
      alert("Por favor, graba tu voz.");
      return;
    }

    const username = this.usernameControl.value; // Usar el valor del control como userId

    this.authService.loginPassword(username, this.audioBlob).subscribe(
      (response) => {
        // Manejar la respuesta del backend
        if (response.valid) {
          alert("Voz validada con éxito!");
        } else {
          alert("Validación de voz fallida.");
        }
      },
      (error) => {
        // Manejar errores
        alert("Error al validar la voz.");
        console.error(error);
      }
    );
  }



}
