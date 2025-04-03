import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private baseUrl = 'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/appointments';

  constructor(private http: HttpClient) { }

  getAvailableSlots(): Observable<any> {
    const url = `${this.baseUrl}/getAvailableSlots`;
    return this.http.get<any>(url);
  }

  getAvailableSlotsByDoctor(doctorId: number): Observable<any> {
    const url = `${this.baseUrl}/getAvailableSlotsByDoctor`;
    const params = new HttpParams().set('doctorId', doctorId.toString());
    return this.http.get<any>(url, { params });
  }

  getAvailableSlotsByService(serviceId: number): Observable<any> {
    const url = `${this.baseUrl}/getAvailableSlotsByService`;
    const params = new HttpParams().set('serviceId', serviceId.toString());
    return this.http.get<any>(url, { params });
  }

  addAppointmentWithNotification(appointment: any): Observable<any> {
    const url = `${this.baseUrl}/addAppointmentWithNotification`;
    return this.http.post<any>(url, appointment);
  }

  cancelAppointment(appointmentId: number, patientId: number): Observable<any> {
    const url = `${this.baseUrl}/cancelAppointment`;
    const params = new HttpParams()
      .set('appointmentId', appointmentId.toString())
      .set('patientId', patientId.toString());

    return this.http.delete<any>(url, { params });
  }
}
