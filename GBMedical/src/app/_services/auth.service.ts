import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private baseUrlLogin = 'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/patients';

  // Async login metódus
  async login(email: string, password: string): Promise<any> {
    const loginData = {
      email: email,
      password: password
    };

    try {
      const response = await fetch(`${this.baseUrlLogin}/loginPatient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      if (!response.ok) {
        // Ha a HTTP státuszkód nem 2xx, hibakezelés
        const errorData = await response.text();
        throw new Error(`Hiba történt: ${response.status} - ${errorData}`);
      }

      // A válasz JSON formátumú
      const data = await response.json();
      return data;
    } catch (error) {
      // Itt lehet pl. loggolni, vagy tovább dobni az error-t
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


}
