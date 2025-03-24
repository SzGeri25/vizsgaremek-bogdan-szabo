import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

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
        // JSON formátumú hibaválasz feltételezése
        const errorData = await response.json();
        // Itt közvetlenül dobjuk az errorData-t, így a komponensben hozzáférhető lesz a status mező
        throw errorData;
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
    this.isAuthenticatedSubject.next(false);
  }

  private decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Hiba a token dekódolásakor:', error);
      return null;
    }
  }

  getUserId(): number | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    const decodedToken = this.decodeToken(token);
    return decodedToken?.id ? parseInt(decodedToken.id, 10) : null;
  }

  getIsAdmin(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    const decodedToken = this.decodeToken(token);
    return decodedToken?.isAdmin === true;
  }
}