import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    userRole: string;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.authService.getAuthClaims().subscribe(claims => {
            if(claims)
                this.userRole = claims.role;
        })
    }

    logout() {
        this.authService.logout()
            .then(() => {
                this.router.navigate(['/login']);
            });
    }
}
