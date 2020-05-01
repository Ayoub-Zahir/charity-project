import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { User } from 'src/app/models/User';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CloudFunctionsService {

    private refreshNeeded = new Subject<void>();

    constructor(private angularFireFunctions: AngularFireFunctions) { }

    getRefreshNeeded() {
        return this.refreshNeeded;
    }

    initSuperAdminAccount() {
        const initSuperAdminAccount = this.angularFireFunctions.httpsCallable('initSuperAdminAccount');

        return initSuperAdminAccount(null);
    }

    createNewUser(userInfo) {
        const createNewUser = this.angularFireFunctions.httpsCallable('createNewUser');

        return createNewUser(userInfo);
    }

    getAllUsers() {
        const getAllUsers = this.angularFireFunctions.httpsCallable('getAllUsers');

        return getAllUsers(null);
    }

    getUser(uid: string) {
        const getUser = this.angularFireFunctions.httpsCallable('getUser');

        return getUser(uid);
    }

    updateUser(user: User) {
        const updateUser = this.angularFireFunctions.httpsCallable('updateUser');

        return updateUser(user);
    }

    resetUserPassword(uid: string, password: string) {
        const resetUserPassword = this.angularFireFunctions.httpsCallable('resetUserPassword');

        return resetUserPassword({ uid, password });
    }

    deleteUser(uid: string) {
        const deleteUser = this.angularFireFunctions.httpsCallable('deleteUser');

        return deleteUser(uid);
    }
}
