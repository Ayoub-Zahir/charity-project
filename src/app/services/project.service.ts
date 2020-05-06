import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Project } from '../models/Project';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private projectsCollection: AngularFirestoreCollection<Project>;
    private projectDocument: AngularFirestoreDocument<Project>;

    constructor(
        private angularFirestore: AngularFirestore,
    ) {
        this.projectsCollection = this.angularFirestore.collection('projects', ref => ref.orderBy('startDate', 'desc'));
    }

    getProjects(): Observable<Project[]> {
        return this.projectsCollection.snapshotChanges().pipe(
            map(changes => changes.map(action => {
                const data = action.payload.doc.data() as Project;

                const id = action.payload.doc.id;

                return { id, ...data };
            }))
        );
    }

    getProject(id: string): Observable<Project>{
        this.projectDocument = this.projectsCollection.doc(id);
        return this.projectDocument.valueChanges();
    }

    add(project): Promise<DocumentReference> {
        return this.projectsCollection.add(project);
    }

    update(projectId: string, data: Project): Promise<void>{
        return this.projectsCollection.doc(projectId).update(data);
    }
}
