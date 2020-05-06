import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    email: string = '';
    password: string = '';
    loading: boolean = false;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private router: Router
    ) { }

    ngOnInit(): void {
    }

    onLogin(form) {

        // Form valid processing ...
        if (form.valid) {

            // Display spinner
            this.loading = true;

            // Login from the Firebase authentication service
            this.authService.login(form.value.email, form.value.password)
                .then(() => {
                    
                    this.userService.updateLastSigninTime(this.authService.getAuthUid());

                    this.router.navigate(['/projects']);

                    // Success login
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Welcome Back !!',
                        showConfirmButton: false,
                        timer: 2000
                    })
                })
                .catch(err => {
                    console.error(err.message);
                    // Hide spinner
                    this.loading = false;

                    // Email not exist
                    if (err.code === 'auth/invalid-email') {
                        form.controls.email.setErrors({ 'pattern': true });
                    }

                    // Email not exist
                    if (err.code === 'auth/user-not-found') {
                        form.controls.email.setErrors({ 'emailNotExist': true });
                    }

                    // Password incorrect
                    if (err.code === 'auth/wrong-password') {
                        form.controls.password.setErrors({ 'passwordIncorrect': true });
                    }

                    // Email disabled
                    if (err.code === 'auth/user-disabled') {
                        form.controls.email.setErrors({ 'emailDisabled': true });
                    }
                });

        }
        else {
            // Error form invalid
            form.form.markAllAsTouched();
        }
    }

}
