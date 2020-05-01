import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/Project';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-add-project',
    templateUrl: './add-project.component.html',
    styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
    users = [
        {name: 'Ali'},
        {name: 'Mohamed'},
        {name: 'Ayoub'},
    ];
    currentProject: Project = {
        projectName: '',
        startDate: new Date().toLocaleDateString('en-CA'),
        attachedUsers:'',
        budget: 0,
        estimeCost: 0,
        location: 'Pakistan',
        description: ''
    };
  
    constructor() { }

    ngOnInit(): void {
    }

    onAddProject(addProjectform) {
        if (addProjectform.valid) {
            console.log(addProjectform.value);
        } else{
            // Error form invalid
            addProjectform.form.markAllAsTouched();
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
