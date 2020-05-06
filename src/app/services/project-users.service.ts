import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class ProjectUsersService {
    projectUsersCollection;

    constructor(private angularFirestore: AngularFirestore) { 
        this.projectUsersCollection = this.angularFirestore.collection('project_users');
    }

    add(projectId: string, [uid, isAssigned]){
        return this.projectUsersCollection.doc(projectId)
            .set({
                [uid]: isAssigned
            }, { merge: true });
    }

    update(projectId: string, [uid, isAssigned]){
        return this.projectUsersCollection.doc(projectId)
            .update({
                [uid]: isAssigned
            });
    }

    getUsers(projectID: string){
        return this.projectUsersCollection.doc(projectID).valueChanges();
    }
}
