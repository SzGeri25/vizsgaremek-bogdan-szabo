import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.getUserId()) { 
      alert('Nincs ehhez jogosultságod! Be kell jelentkezned.');
      this.router.navigate(['/login']);
      return false;
    }

    if (!this.authService.getIsAdmin()) {
      alert('Nincs admin jogosultságod!');
      this.router.navigate(['/home']);
      return false;
    }

    return true; // Ha be van jelentkezve és admin, engedélyezzük a navigációt
  }
}
