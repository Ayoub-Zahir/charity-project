import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CloudFunctionsService } from 'src/app/services/cloud-functions.service';

import { User } from 'src/app/models/User';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
    currentUser: User;

    loading: boolean = true;

    constructor(
        private activatedRoute: ActivatedRoute,
        private cloudFunctionsService: CloudFunctionsService,
        private router: Router,
        private ngZone: NgZone
    ) { }

    ngOnInit() {
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
                    disabled: user.disabled,
                    creationDate: user.metadata.creationTime,
                    lastSigninTime: user.metadata.lastSignInTime,
                }

                // Stop loading ...
                this.loading = false;

            });
    }

    onDeleteUser(uid: string) {
        // Confirm dialog
        Swal.fire({
            title: 'Are you sure you want to detete this User?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F25F5C',
            cancelButtonColor: '#3C91E6',
            confirmButtonText: 'Yes, delete it!',
        })
            .then(result => {
                if (result.value) {
                    this.cloudFunctionsService.deleteUser(uid)
                        .subscribe((res) => {
                            console.log(res);

                            // Success deleting user => Hard refresh
                            this.ngZone.run(() => {
                                this.router.navigateByUrl('/dashboard', { skipLocationChange: true })
                                    .then(() => {
                                        this.router.navigate(['/users']).then(() => {
                                            // Success alert after deleting the client
                                            Swal.fire({
                                                position: 'top-end',
                                                icon: 'success',
                                                titleText: 'The User has been successfully deleted',
                                                showConfirmButton: false,
                                                timer: 2000,
                                            });
                                        });
                                    });
                            });
                        });
                }
            });
    }

}
