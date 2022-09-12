import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Blog } from 'src/app/models/blog.model';
import { Category } from 'src/app/models/category.model';
import { BlogService } from 'src/app/shared/services/blog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AddEditBlogForm } from 'src/app/models/add-edit-blog-form.model';
@Component({
  selector: 'app-add-edit-blog',
  templateUrl: './add-edit-blog.component.html',
  styleUrls: ['./add-edit-blog.component.scss'],
})
export class AddEditBlogComponent implements OnInit {
  public blogForm: FormGroup = new FormGroup([]);
  categories: Category[] = [];
  selectedCategory: number = 0;
  @ViewChild('editor') editor;
  constructor(
    @Inject(MAT_DIALOG_DATA) public blogData: Blog,
    public dialogRef: MatDialogRef<AddEditBlogComponent>,
    private blogService: BlogService,
    private fb: FormBuilder,
    public toster: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
    if (this.blogData) {
      this.selectedCategory = this.blogData.categoryId;
    }
    this.blogForm = this.fb.group({
      blogTitle: [
        !!this.blogData ? this.blogData.blogTitle : null,
        [Validators.required],
      ],
      blogContents: [
        !!this.blogData ? this.blogData.blogContents : null,
        [Validators.required],
      ],
      blogShortContents: [
        !!this.blogData ? this.blogData.blogShortContents : null,
        [Validators.required, Validators.maxLength(300)],
      ],
      categoryId: [
        !!this.blogData ? this.blogData.categoryId : null,
        [Validators.required],
      ],
    });
  }

  getAllCategories(): void {
    this.blogService.getAllCategories().subscribe((res) => {
      this.categories = res.data;
    });
  }

  hasError(control: string, validator: string): boolean {
    return (
      this.blogForm.controls[control]?.touched &&
      this.blogForm.controls[control].errors?.[validator]
    );
  }

  add(): void {
    const data = new AddEditBlogForm();
    data.blogContents = this.blogForm.value.blogContents;
    data.blogTitle = this.blogForm.value.blogTitle;
    data.categoryId = this.blogForm.value.categoryId;
    data.blogShortContents = this.blogForm.value.blogShortContents;
    this.blogService.addBlog(data).subscribe((res) => {
      if (res && res.succeeded) {
        this.blogForm.reset();
        this.dialogRef.close({ event: 'success' });
        this.toster.success(res.message);
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });
  }

  update(): void {
    const data = new AddEditBlogForm();
    data.blogId = this.blogData.blogId;
    data.blogContents = this.blogForm.value.blogContents;
    data.blogTitle = this.blogForm.value.blogTitle;
    data.categoryId = this.blogForm.value.categoryId;
    data.blogShortContents = this.blogForm.value.blogShortContents;
    this.blogService.updateBlog(data).subscribe((res) => {
      if (res && res.succeeded) {
        this.blogForm.reset();
        this.dialogRef.close({ event: 'success' });
        this.toster.success(res.message);
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
