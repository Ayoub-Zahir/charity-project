import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.authService.getAuthClaims().subscribe(claims => {
                if (claims?.role === 'Super Admin') {
                    resolve(true);
                } else {
                    this.router.navigate(['/projects']);
                    reject(false);
                }
            });
        });
    }

}
