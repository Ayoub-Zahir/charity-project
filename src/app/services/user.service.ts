import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private angularFireAuth: AngularFireAuth) { }

}
