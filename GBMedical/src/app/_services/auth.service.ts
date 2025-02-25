import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // A bejelentkezés kezdetben false, de ellenőrizheted a localStorage-t is
  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!localStorage.getItem('authToken'));

  // Observable, amelyre a komponensek feliratkozhatnak
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor() { }

  async login(email: string, password: string): Promise<any> {
    const loginData = { email, password };

    try {

      const response = await fetch('http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/patients/loginPatient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Hiba történt: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('Felhasználó adatai tokennel együtt:', data);

      // Token és felhasználói adatok mentése
      localStorage.setItem('authToken', data.result.jwt);
      localStorage.setItem('userData', JSON.stringify(data.user));

      // Frissítsd az autentikációs állapotot, hogy a feliratkozott komponensek (pl. Navbar) értesüljenek
      this.isAuthenticatedSubject.next(true);

      return data;
    } catch (error) {
      console.error('Login hiba:', error);
      throw error;
    }
  }


  private baseUrlRegister = 'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/patients';

  // Async register metódus
  async register(patientData: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrlRegister}/registerPatient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Hiba történt: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Regisztráció hiba:', error);
      throw error;
    }
  }



  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.isAuthenticatedSubject.next(false);
  }
}
