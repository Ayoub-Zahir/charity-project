import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';

// Rxjs
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Models
import { Category } from '../models/Category';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private categorysCollection: AngularFirestoreCollection<Category>;
    private categoryDocument: AngularFirestoreDocument<Category>;

    constructor(private angularFirestore: AngularFirestore) {
        this.categorysCollection = this.angularFirestore.collection('categories', ref => ref.orderBy('name', 'desc'));
    }

    add(category: Category): Promise<DocumentReference>{
        return this.categorysCollection.add(category);
    }

    getAllCategories(): Observable<Category[]>{
        return this.categorysCollection.snapshotChanges()
            .pipe( map(changes => changes.map(action => {
                const data = action.payload.doc.data() as Category;

                const id = action.payload.doc.id;

                return { id, ...data };
            })))
    }

    get(id: string): Observable<Category>{
        this.categoryDocument = this.categorysCollection.doc(id);

        return this.categoryDocument.valueChanges();
    }

    update(id: string, data: Category): Promise<void>{
        return this.categorysCollection.doc(id).update(data); 
    }

    delete(id: string): Promise<void>{
        return this.categorysCollection.doc(id).delete(); 
    }
}
