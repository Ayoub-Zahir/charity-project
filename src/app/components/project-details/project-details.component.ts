import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Services
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import { ProjectUsersService } from 'src/app/services/project-users.service';

// Models
import { Project } from 'src/app/models/Project';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

    currentProject: Project;
    loading: boolean = true;
    projectId: string;
    userRole: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private projectService: ProjectService,
        private projectUsersService: ProjectUsersService,
        private userService: UserService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        // Get user role
        this.authService.getAuthClaims().subscribe(claims => {
            if (claims)
                this.userRole = claims.role;
        });

        // Get project ID
        this.projectId = this.activatedRoute.snapshot.paramMap.get('id');

        // Fetch current project
        this.projectService.getProject(this.projectId).subscribe(project => {
            if (project) {

                // Get current project users
                this.projectUsersService.getUsers(this.projectId)
                    .subscribe(projectUsersDoc => {
                        project.assignedUsers = [];

                        for (let [uid, isAssigned] of Object.entries(projectUsersDoc)) {
                            if (isAssigned) {
                                this.userService.getUser(uid).subscribe(userData => project.assignedUsers.push(userData));
                            }
                        }

                        this.currentProject = project;
                        this.loading = false;
                    });
            }
            else
                this.loading = false;

        })
    }

}
