import { Component, OnInit } from '@angular/core';

// Services
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectUsersService } from 'src/app/services/project-users.service';

// Models
import { Project } from 'src/app/models/Project';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-dash-projects',
    templateUrl: './dash-projects.component.html',
    styleUrls: ['./dash-projects.component.css']
})
export class DashProjectsComponent implements OnInit {
    projects: Project[] = [];
    loading: boolean = true;
    userRole: string;

    constructor(
        private projectService: ProjectService,
        private projectUsersService: ProjectUsersService,
        private userService: UserService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {

        // Get user role
        this.authService.getAuthClaims().subscribe(claims => {
            if(claims)
                this.userRole = claims.role;   
        });

        // Fetching data
        this.projectService.getProjects().subscribe(projects => {

            if (projects.length !== 0) {

                // Fetch All Projects
                projects.forEach(project => {

                    // Get current project users
                    this.projectUsersService.getUsers(project.id)
                        .subscribe(projectUsersDoc => {
                            project.assignedUsers = [];

                            for (let [uid, isAssigned] of Object.entries(projectUsersDoc)) {
                                if (isAssigned) {
                                    this.userService.getUser(uid).subscribe(userData => project.assignedUsers.push(userData));
                                }
                            }

                            this.projects.push(project);
                            this.loading = false;
                        });
                });
            }
            else
                this.loading = false;
        })
    }

}
