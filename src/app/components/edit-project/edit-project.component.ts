import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import { ProjectUsersService } from 'src/app/services/project-users.service';

// Models
import { Project } from 'src/app/models/Project';

// Libs
import Swal from 'sweetalert2';

@Component({
    selector: 'app-edit-project',
    templateUrl: './edit-project.component.html',
    styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {

    currentProject: Project;
    loading: boolean = true;
    editProcessLoading: boolean = false;
    projectId: string;

    constructor(
        private projectService: ProjectService,
        private projectUsersService: ProjectUsersService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.projectId = this.activatedRoute.snapshot.paramMap.get('id');

        this.projectService.getProject(this.projectId).subscribe(project => {
            if (project) {

                // Get current project users
                this.projectUsersService.getUsers(this.projectId)
                    .subscribe(projectUsersDoc => {
                        project.assignedUsers = [];

                        for (let [uid, isAssigned] of Object.entries(projectUsersDoc)) {
                            this.userService.getUser(uid).subscribe(userData => {
                                userData.isAssigned = isAssigned as boolean;

                                project.assignedUsers.push(userData);
                            });
                        }

                        this.currentProject = project;
                        this.loading = false;
                    });
            }
            else
                this.loading = false;
        })
    }

    onEditProject(editProjectform) {
        // Check if the project is attached by at least one user.
        const isAttached = Object.values(editProjectform.value.assignedUsers).includes(true);
        if (!isAttached) {
            editProjectform.controls.assignedUsers.setErrors({ 'notAssigned': true });
        }

        // VALID
        if (editProjectform.valid) {

            this.editProcessLoading = true;
            delete this.currentProject.assignedUsers;
            const assignedUsers = editProjectform.value.assignedUsers;

            // Update project
            this.projectService.update(this.projectId, this.currentProject)
                .then(() => {

                    // Update into project_users collection
                    for (let [uid, isAssigned] of Object.entries(assignedUsers)) {
                        this.projectUsersService.update(this.projectId, [uid, isAssigned]);
                    }

                    this.editProcessLoading = false;
                    editProjectform.reset();

                    this.router.navigate([`/projects/${this.projectId}`])
                        .then(() => {
                            // Alert success updating user
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                titleText: 'The Project has been successfully updated',
                                showConfirmButton: false,
                                timer: 2300,
                            });
                        });
                })

        }
        else {
            // Error form invalid
            editProjectform.form.markAllAsTouched();
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
