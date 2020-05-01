import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const initSuperAdminAccount = functions.region('asia-east2').https.onCall(() => {
    return admin.auth().getUserByEmail('super-admin@gmail.com')
        .then(() => 'Super Admin already exist !!')
        .catch(err => {
            if (err.code === 'auth/user-not-found') {
                // Create admin account
                return admin.auth().createUser({
                    email: 'super-admin@gmail.com',
                    password: '123456',
                    photoURL: 'assets/img/super-admin.svg'
                })
                    .then(adminRecord => {
                        // Set custum claims
                        return admin.auth().setCustomUserClaims(adminRecord.uid, {
                            role: 'Super Admin',
                        })
                            .then(() => `Super Admin: ${adminRecord.email} has been added successfully.`)
                            .catch(err => err);
                    })
                    .catch(err => err);
            }
            return err;
        });
});

export const createNewUser = functions.region('asia-east2').https.onCall((user, context) => {
    if (context.auth?.token.role === "Super Admin") {
        return admin.auth().createUser({
            email: user.email,
            password: user.password,
            displayName: user.fullName
        })
            .then(userRecord => {
                // Set custum claims
                return admin.auth().setCustomUserClaims(userRecord.uid, {
                    role: user.role
                })
                    .then(() => `${user.role}: ${userRecord.email} has been added successfully`)
                    .catch(err => err);
            })
            .catch(err => err);
    }
    else
        return { error: 'Only Super Admin can do this operation.'};
});

export const getAllUsers = functions.region('asia-east2').https.onCall((any, context) => {
    if (context.auth?.token.role === 'Super Admin')
        return admin.auth().listUsers();
    else
        return { error: 'Only Super Admin can do this operation.' };
});

export const getUser = functions.region('asia-east2').https.onCall((uid, context) => {
    if (context.auth?.token.role === 'Super Admin')
        return admin.auth().getUser(uid);
    else
        return { error: 'Only Super Admin can do this operation.' };
});

export const updateUser = functions.region('asia-east2').https.onCall((user, context) => {
    if (context.auth?.token.role === 'Super Admin')
        return admin.auth().updateUser(user.uid, {
            email: user.email,
            phoneNumber: user.phone,
            displayName: user.fullName,
            photoURL: user.imgURL,
            disabled: user.disabled
        })
            .then(userNewRecode => {
                // Set custum claims
                return admin.auth().setCustomUserClaims(userNewRecode.uid, {
                    role: user.role
                })
                    .then(() => `${user.role}: ${userNewRecode.email} has been updatetd successfully.`)
                    .catch(err => err);
            })
            .catch(err => err);
    else
        return { error: 'Only Super Admin can do this operation.' };
});

export const resetUserPassword = functions.region('asia-east2').https.onCall((user, context) => {
    if (context.auth?.token.role === 'Super Admin')
        return admin.auth().updateUser(user.uid, {
            password: user.password,
        })
            .then((userRecode) => `${userRecode.email} : The password has been successfully reset.`)
            .catch(err => err);
    else
        return { error: 'Only Super Admin can do this operation.'};
});

export const deleteUser = functions.region('asia-east2').https.onCall((uid, context) => {
    if (context.auth?.token.role === 'Super Admin')
        return admin.auth().deleteUser(uid)
            .then(() => `User has been successfully deleted.`)
            .catch(err => err);
    else
        return { error: 'Only Super Admin can do this operation.'};
});