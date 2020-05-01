import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CloudFunctionsService } from 'src/app/services/cloud-functions.service';

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

    currentUser = {
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        fullName: ''
    };

    loading: boolean = false;

    constructor(
        private cloudFunctionsService: CloudFunctionsService
    ) { }

    ngOnInit() {
    }

    onAddUser(addUserform) {
        if (addUserform.valid && 
            this.currentUser.password === this.currentUser.confirmPassword) {

            this.loading = true;
            
            this.cloudFunctionsService.createNewUser(this.currentUser)
                .subscribe((res) => {
                    console.log(res);
                    this.loading = false;

                    if (res?.errorInfo?.code === 'auth/email-already-exists'){
                        addUserform.controls.email.setErrors({ 'emailExist': true });
                    }
                    else {
                        // Alert success creating user              
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'The user has been successfully created',
                            showCancelButton: true,
                            showConfirmButton: true,
                            confirmButtonText: '<a href="/users" style="color: white;text-decoration: none;">Go To Dashboard <span uk-icon="forward"></span></a> ',
                            cancelButtonText: 'Close <span uk-icon="close"></span>'
                        });

                        this.currentUser = {
                            email: '',
                            password: '',
                            confirmPassword: '',
                            role: '',
                            fullName: ''
                        };

                        addUserform.form.markAsUntouched();
                    }
                });

        } else {
            // Error form invalid
            addUserform.form.markAllAsTouched();
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
