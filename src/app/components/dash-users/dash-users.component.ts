import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { CloudFunctionsService } from 'src/app/services/cloud-functions.service';
import { UserService } from 'src/app/services/user.service';

// Models
import { User } from 'src/app/models/User';

// Libs
import Swal from 'sweetalert2';

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
        private userService: UserService,
        private router: Router,
        private ngZone: NgZone
    ) { }

    ngOnInit(): void {
        this.userService.getAllUsers().subscribe(users => {
            this.users = users;
            this.loading = false;
        }, err => console.error(err.message))
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
                            this.deleteProcessLoading = false;
                        });
                }
            });
    }
}
