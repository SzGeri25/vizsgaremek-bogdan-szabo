import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = `http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/appointments/getAvailableSlotsByDoctor`;
  private addAppointmentUrl = 'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/appointments/addAppointmentWithNotification';

  constructor(private http: HttpClient) { }

  getAvailableSlots(doctorId: number): Observable<any> {
    // A HttpParams automatikusan elvégzi a szükséges URL-kódolást
    let params = new HttpParams()
      .set('doctorId', doctorId.toString())

    return this.http.get<any>(this.apiUrl, { params: params });
  }

  addAppointmentWithNotification(appointment: any): Observable<any> {
    return this.http.post<any>(this.addAppointmentUrl, appointment);
  }
}
