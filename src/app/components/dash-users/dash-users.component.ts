import { Component, OnInit, NgZone } from '@angular/core';
import { CloudFunctionsService } from 'src/app/services/cloud-functions.service';
import { User } from 'src/app/models/User';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dash-users',
    templateUrl: './dash-users.component.html',
    styleUrls: ['./dash-users.component.css']
})
export class DashUsersComponent implements OnInit {
    users: User[] = [];
    loading: boolean = true;
    deleteProcessLoading: boolean = false;

    constructor(
        private cloudFunctionsService: CloudFunctionsService,
        private router: Router,
        private ngZone: NgZone
    ) { }

    ngOnInit(): void {
        this.cloudFunctionsService.getAllUsers()
            .subscribe(data => {
                // console.log(data);

                if (!data.error) {
                    // Set up Users array
                    data.users.forEach(user => {
                        if (user.customClaims.role !== 'Super Admin') {

                            // Set default users img
                            if (user.photoURL === null) {
                                if (user.customClaims.role === 'Admin')
                                    user.photoURL = 'assets/img/admin2.svg';
                                if (user.customClaims.role === 'User')
                                    user.photoURL = 'assets/img/user2.svg';
                            }

                            const currentUser: User = {
                                uid: user.uid,
                                email: user.email,
                                role: user.customClaims.role,
                                fullName: user.displayName,
                                imgURL: user.photoURL,
                                phone: user.phoneNumber,
                                creationDate: user.metadata.creationTime,
                                lastSigninTime: user.metadata.lastSignInTime
                            }

                            this.users.push(currentUser);
                        }
                    });

                    this.loading = false;

                } else {
                    this.loading = false;
                    console.error(`Error: ${data.error}`);
                }
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
            // focusConfirm: false
        })
            .then(result => {
                if (result.value) {
                    this.deleteProcessLoading = true;

                    this.cloudFunctionsService.deleteUser(uid)
                        .subscribe((res) => {
                            console.log(res);

                            // Success deleting user => Hard refresh
                            this.ngZone.run(() => {
                                this.router.navigateByUrl('/dashboard', { skipLocationChange: true })
                                    .then(() => {
                                        this.router.navigate(['/users'])
                                            .then(() => {
                                                // Success alert after deleting the client
                                                Swal.fire({
                                                    position: 'top-end',
                                                    icon: 'success',
                                                    titleText: 'The User has been successfully deleted',
                                                    showConfirmButton: false,
                                                    timer: 2300,
                                                });
                                            });
                                    });
                            });
                        });
                }
            });
    }
}
