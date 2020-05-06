import { Component, OnInit } from '@angular/core';

// Services
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectUsersService } from 'src/app/services/project-users.service';

// Models
import { Project } from 'src/app/models/Project';
import { User } from 'src/app/models/User';

// Libs
import Swal from 'sweetalert2';

@Component({
    selector: 'app-add-project',
    templateUrl: './add-project.component.html',
    styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

    loading: boolean = true;
    addProcessLoading: boolean = false;
    users: User[];
    currentProject: Project = {
        projectName: '',
        startDate: new Date().toLocaleDateString('en-CA'),
        isComplete: false,
        budget: null,
        estimeCost: null,
        estimeTime: null,
        location: '',
        description: ''
    };

    constructor(
        private userService: UserService,
        private projectService: ProjectService,
        private projectUsersService: ProjectUsersService
    ) { }

    ngOnInit(): void {
        // Get Users
        this.userService.getUsersByRole('User').subscribe(users => {
            this.users = users;
            this.loading = false;
        })
    }

    onAddProject(addProjectform) {

        // Check if the project is attached by at least one user.
        const isAttached = Object.values(addProjectform.value.assignedUsers).includes(true);
        if (!isAttached) {
            addProjectform.controls.assignedUsers.setErrors({ 'notAssigned': true });
        }

        // VALID Form
        if (addProjectform.valid) {
            this.addProcessLoading = true;

            // Add into projects collection
            this.projectService.add(this.currentProject)
                .then((docRef) => {

                    // Add into projectusers collection
                    for (let [uid, isAssigned] of Object.entries(addProjectform.value.assignedUsers)) {
                        this.projectUsersService.add(docRef.id, [uid, isAssigned]);
                    }

                    this.addProcessLoading = false;

                    // Alert success creating project              
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'The Project has been successfully created',
                        showCancelButton: true,
                        showConfirmButton: true,
                        confirmButtonText: '<a href="/projects" style="color: white;text-decoration: none;">Go To Dashboard <span uk-icon="forward"></span></a> ',
                        cancelButtonText: 'Close <span uk-icon="close"></span>'
                    });

                    addProjectform.reset();

                })
                .catch(err => console.error(err));

        } else {
            // Error form invalid
            addProjectform.form.markAllAsTouched();
            Swal.fire({
                icon: 'error',
                title: 'From invalid...',
                text: 'Please fill out the form correctly!',
                showCloseButton: true,
                confirmButtonText: 'Try Again',
                focusConfirm: false,
            });
        }
    }
}
