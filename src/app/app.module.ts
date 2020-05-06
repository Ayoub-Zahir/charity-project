import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Firebase modules
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';

// Components
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';

// Services
import { AuthService } from '../app/services/auth.service';
import { CloudFunctionsService } from '../app/services/cloud-functions.service';
import { UserService } from '../app/services/user.service';
import { ProjectService } from '../app/services/project.service';
import { ProjectUsersService } from '../app/services/project-users.service';

// Routing module && components
import { AppRoutingModule, routingComponents } from './app-routing.module';

// Environment
import { environment } from 'src/environments/environment';

@NgModule({
    declarations: [
        AppComponent,
        routingComponents,
        SidebarComponent,
        NavbarComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireFunctionsModule
    ],
    providers: [
        { provide: REGION, useValue: 'asia-east2' },
        AuthService,
        CloudFunctionsService,
        UserService,
        ProjectService,
        ProjectUsersService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
