import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../models/User';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private usersCollection: AngularFirestoreCollection<User>;
    private userDocument: AngularFirestoreDocument<User>;

    constructor(private angularFirestore: AngularFirestore) {
        this.usersCollection = this.angularFirestore.collection('users', ref => ref.orderBy('creationDate', 'desc'));
    }

    getAllUsers(): Observable<User[]> {
        return this.usersCollection.valueChanges();
    }

    getUsersByRole(role: string) {
        this.usersCollection = this.angularFirestore.collection('users', ref => ref.where('role', '==', role));

        return this.usersCollection.valueChanges();
    }

    getUser(uid: string): Observable<User> {
        this.userDocument = this.usersCollection.doc(uid);
        return this.userDocument.valueChanges();
    }

    updateLastSigninTime(uid: string): void {
        const userDoc = this.usersCollection.doc(uid);

        userDoc.get()
            .subscribe(docSnapshot => {
                if (docSnapshot.exists) {
                    userDoc.update({ lastSigninTime: new Date() });
                }
            });
    }

}
