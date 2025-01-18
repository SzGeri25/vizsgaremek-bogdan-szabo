import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = 'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/appointments/getBookedAppointments';

  constructor(private http: HttpClient) { }

  getBookedAppointments(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
