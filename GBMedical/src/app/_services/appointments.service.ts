import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = 'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/appointments/getAvailableSlots';

  constructor(private http: HttpClient) { }

  getAvailableSlots(doctorId: number, startDate: string, endDate: string): Observable<any> {
    // A HttpParams automatikusan elvégzi a szükséges URL-kódolást
    let params = new HttpParams()
      .set('doctorId', doctorId.toString())
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<any>(this.apiUrl, { params: params });
  }
}
