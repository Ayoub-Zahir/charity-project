import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CloudFunctionsService } from 'src/app/services/cloud-functions.service';

import { User } from 'src/app/models/User';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
    // Data model for forms
    currentUser: User;
    resetPassword = {
        newPassword: '',
        confirmNewPassword: ''
    };

    // Loading props
    loading: boolean = true;
    updateProcessLoading: boolean = false;
    resetPasswordLoading: boolean = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private cloudFunctionsService: CloudFunctionsService,
        private router: Router,
        private ngZone: NgZone
    ) { }

    ngOnInit(): void {
        const uid: string = this.activatedRoute.snapshot.paramMap.get('uid');

        this.cloudFunctionsService.getUser(uid)
            .subscribe(user => {

                // Set default users img
                if (user.photoURL === null) {
                    if (user.customClaims.role === 'Admin')
                        user.defaultImg = 'assets/img/admin2.svg';
                    if (user.customClaims.role === 'User')
                        user.defaultImg = 'assets/img/user2.svg';
                }

                this.currentUser = {
                    uid: user.uid,
                    email: user.email,
                    role: user.customClaims.role,
                    fullName: user.displayName,
                    imgURL: user.photoURL,
                    phone: user.phoneNumber,
                    defaultImg: user.defaultImg,
                    disabled: user.disabled
                }

                // Stop loading ...
                this.loading = false;
            })
    }

    onEditUser(editUserform: { valid: boolean, value: User, form: any, controls: any }) {
        if (editUserform.valid) {

            // Start loading ...
            this.updateProcessLoading = true;

            editUserform.value.uid = this.currentUser.uid;

            this.cloudFunctionsService.updateUser(editUserform.value)
                .subscribe(res => {
                    console.log(res);

                    // Stop loading ...
                    this.updateProcessLoading = false;

                    // Check for auth errors coming from (cloud-function) the server
                    if (res.errorInfo?.code === 'auth/invalid-phone-number') {
                        editUserform.controls.phone.setErrors({ 'invalidPhoneNumber': true });
                    }
                    else if (res.errorInfo?.code === 'auth/invalid-photo-url') {
                        editUserform.controls.imgURL.setErrors({ 'invalidImgURL': true });
                    }
                    else if (res.errorInfo?.code === 'auth/email-already-exists') {
                        editUserform.controls.email.setErrors({ 'emailExist': true });
                    }
                    else {
                        // Success updating user => Hard refresh
                        this.ngZone.run(() => {
                            this.router.navigateByUrl(`/dashboard`, { skipLocationChange: true })
                                .then(() => {
                                    this.router.navigate([`/users/${this.currentUser.uid}`])
                                        .then(() => {
                                            // Alert success updating user
                                            Swal.fire({
                                                position: 'top-end',
                                                icon: 'success',
                                                titleText: 'The User has been successfully updated',
                                                showConfirmButton: false,
                                                timer: 2300,
                                            });
                                        });
                                });
                        });
                    }
                });
        }
        else {
            // Error form invalid
            editUserform.form.markAllAsTouched();
            Swal.fire({
                icon: 'error',
                title: 'From invalid...',
                text: 'Please fill out the form correctly!',
                showCloseButton: true,
                confirmButtonText: 'Try Again',
                timer: 2300,
                focusConfirm: false,
            });
        }
    }

    onResetPassword(resetPasswordform) {
        if (resetPasswordform.valid &&
            this.resetPassword.confirmNewPassword === this.resetPassword.newPassword) {

            // Start loading ...
            this.resetPasswordLoading = true;

            this.cloudFunctionsService.resetUserPassword(this.currentUser.uid, this.resetPassword.newPassword)
                .subscribe(res => {
                    console.log(res);

                    // Stop loading ...
                    this.resetPasswordLoading = false;

                    // Alert success updating user              
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'The password has been successfully reset.',
                        showConfirmButton: false,
                        timer: 2300,
                    });

                    // Reset the form
                    resetPasswordform.reset();
                })

        } else {
            // Error form invalid
            resetPasswordform.form.markAllAsTouched();
            Swal.fire({
                icon: 'error',
                title: 'From invalid...',
                text: 'Please fill out the form correctly!',
                showCloseButton: true,
                confirmButtonText: 'Try Again',
                timer: 2300,
                focusConfirm: false,
            });
        }
    }
}
