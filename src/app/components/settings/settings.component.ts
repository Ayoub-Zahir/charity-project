import { Component, OnInit } from '@angular/core';

// Models
import { Category } from 'src/app/models/Category';

// Services
import { CategoryService } from 'src/app/services/category.service';

// Libs
import Swal from 'sweetalert2';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    categories: Category[];
    currentCategory: Category = {
        name: '',
        type: '',
        description: ''
    };
    addProcessLoading: boolean = false;
    deleteProcessLoading: boolean = false;
    loading: boolean = true;

    constructor(private categoryService: CategoryService) { }

    ngOnInit(): void {
        this.categoryService.getAllCategories().subscribe(categories => {
            this.categories = categories;
            this.loading = false;
        })
    }

    onAddCategory(addCategoryform: { valid: boolean, form: any }) {

        if (addCategoryform.valid) {
            this.addProcessLoading = true;

            this.categoryService.add(this.currentCategory)
                .then(() => {
                    this.addProcessLoading = false;

                    // Alert success updating user
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        titleText: 'The Category has been successfully added.',
                        showConfirmButton: false,
                        timer: 2300,
                    });

                    addCategoryform.form.reset();
                    this.currentCategory.type = '';
                })
                .catch(err => console.error(err));
        } else {
            // Error form invalid
            addCategoryform.form.markAllAsTouched();
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

    onDelete(id: string) {
        // Confirm dialog
        Swal.fire({
            title: 'Are you sure you want to detete this Category?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F25F5C',
            cancelButtonColor: '#3C91E6',
            confirmButtonText: 'Yes, delete it!',
        })
            .then(result => {
                if (result.value) {
                    this.deleteProcessLoading = true;

                    this.categoryService.delete(id)
                        .then(() => {
                            this.deleteProcessLoading = false;
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                titleText: 'The Category has been successfully deleted.',
                                showConfirmButton: false,
                                timer: 2300,
                            });
                        });
                }
            });
    }
}
