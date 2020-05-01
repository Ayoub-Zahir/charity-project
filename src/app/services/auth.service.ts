import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private angularFireAuth: AngularFireAuth) { }

    login(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password);
    }

    signup(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password);
    }

    logout(): Promise<void> {
        return this.angularFireAuth.auth.signOut();
    }

    getAuth(): Observable<firebase.User> {
        return this.angularFireAuth.authState;
    }

    // return: Observable<firebase.auth.IdTokenResult.claims>
    getAuthClaims() {
        return this.angularFireAuth.idTokenResult.pipe(map(token => {
            if (token)
                return token.claims;
        }));
    }

    refreshToken() {
        // return this.angularFireAuth.currentUser.getIdToken(true);
    }
}
