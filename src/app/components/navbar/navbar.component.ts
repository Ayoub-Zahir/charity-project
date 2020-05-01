import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    currentUser;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.authService.getAuthClaims().subscribe(user => {
            if (user) {
                this.authService.getAuth().subscribe(userRecord => {
                    if(userRecord){
                        this.currentUser = user;
    
                        if (userRecord.photoURL === null) {
                            if (this.currentUser.role === 'Super Admin')
                                this.currentUser.photoURL = 'assets/img/super-admin.svg';
                            if (this.currentUser.role === 'Admin')
                                this.currentUser.photoURL = 'assets/img/admin2.svg';
                            if (this.currentUser.role === 'User')
                                this.currentUser.photoURL = 'assets/img/user2.svg';
                        } else
                            this.currentUser.photoURL = userRecord.photoURL;  
                    }
                });
            }
        });
    }

}
