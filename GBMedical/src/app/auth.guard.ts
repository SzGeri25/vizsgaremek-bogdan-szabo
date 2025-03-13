import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './_services/auth.service';


@Injectable({
  providedIn: 'root'
  })

  export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
  
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      if (this.authService.getIsAdmin()) {
        return true; // Ha admin, akkor engedélyezett a belépés
      } else {
        this.router.navigate(['/home']); // Ha nem admin, visszairányítás a főoldalra
        return false;
      }
    }
  }
