import { Component } from '@angular/core';
import { CloudFunctionsService } from 'src/app/services/cloud-functions.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'charity-app';

    constructor(private cloudFunctionsService: CloudFunctionsService) {
        // this.cloudFunctionsService.initSuperAdminAccount().subscribe(res => console.log(res));
    }
}
