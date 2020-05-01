import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Components
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';

// Firebase modules
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';

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
        { provide: REGION, useValue: 'asia-east2' }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
