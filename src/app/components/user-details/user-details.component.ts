import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CloudFunctionsService } from 'src/app/services/cloud-functions.service';

import { User } from 'src/app/models/User';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
    
    currentUser: User;
    loading: boolean = true;
    deleteProcessLoading: boolean = false;


    constructor(
        private activatedRoute: ActivatedRoute,
        private cloudFunctionsService: CloudFunctionsService,
        private userService: UserService,
        private router: Router,
        private ngZone: NgZone
    ) { }

    ngOnInit() {
        const uid: string = this.activatedRoute.snapshot.paramMap.get('uid');

        this.userService.getUser(uid).subscribe(user => {
            this.currentUser = user;
            this.loading = false;

        }, err => console.error(err.message));

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
                    this.deleteProcessLoading = true;

                    this.cloudFunctionsService.deleteUser(uid)
                        .subscribe((res) => {
                            console.log(res);
                            this.deleteProcessLoading = false;

                            // Success deleting user Redirect => /users 
                            this.ngZone.run(() => {
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
                }
            });
    }

}
