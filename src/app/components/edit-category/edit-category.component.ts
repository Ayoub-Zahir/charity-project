import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/Category';
import { CategoryService } from 'src/app/services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-edit-category',
    templateUrl: './edit-category.component.html',
    styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

    currentCategory: Category;
    categoryId: string;
    editProcessLoading: boolean = false;
    loading: boolean = true;

    constructor(
        private categoryService: CategoryService,
        private activatedRoute : ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');

        this.categoryService.get(this.categoryId).subscribe(category => {
            this.loading = false;

            if(category)
                this.currentCategory = category;
            else
                console.error('Category Not Found !!');
        })
    }

    onEditCategory(editCategoryform){
        if (editCategoryform.valid) {
            this.editProcessLoading = true;

            this.categoryService.update(this.categoryId, this.currentCategory)
                .then(() => {
                    this.editProcessLoading = false;

                    // Alert success updating user
                    this.router.navigate(['/settings']).then(()=>{
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            titleText: 'The Category has been successfully added.',
                            showConfirmButton: false,
                            timer: 2300,
                        });
                    })

                })
                .catch(err => console.error(err));
        } else {
            // Error form invalid
            editCategoryform.markAllAsTouched();
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
