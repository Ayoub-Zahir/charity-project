import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-dash-projects',
    templateUrl: './dash-projects.component.html',
    styleUrls: ['./dash-projects.component.css']
})
export class DashProjectsComponent implements OnInit {

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.authService.getAuthClaims().subscribe(claims => {
          console.log(claims);
        });
    }

}
