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
  imageToUpload: any;
  imageUrl: any;
  imageRemoved: boolean = false;
  @ViewChild('editor') editor;
  @ViewChild('imageInput') imageInput;
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
    if (this.blogData && this.blogData.blogImageName) {
      this.imageUrl = this.blogData.blogImageName;
    }
  }

  handleFileInput(file: FileList | any) {
    if (file.target.files && file.target.files.length) {
      this.imageRemoved = false;
      this.imageToUpload = file.target.files.item(0);
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
      };
      reader.readAsDataURL(this.imageToUpload);
    }
  }

  onImageRemove(): void {
    this.imageInput.nativeElement.value = '';
    this.imageRemoved = true;
    this.imageToUpload = null;
    this.imageUrl = null;
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
    data.BlogContents = this.blogForm.value.blogContents;
    data.BlogTitle = this.blogForm.value.blogTitle;
    data.CategoryId = this.blogForm.value.categoryId;
    data.BlogShortContents = this.blogForm.value.blogShortContents;
    if (this.imageToUpload) {
      data.BlogImage = this.imageToUpload;
    }
    this.blogService.addBlog(data).subscribe((res) => {
      if (res && res.succeeded) {
        this.blogForm.reset();
        this.imageToUpload = null;
        this.imageUrl = null;
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
    data.BlogId = this.blogData.blogId;
    data.BlogContents = this.blogForm.value.blogContents;
    data.BlogTitle = this.blogForm.value.blogTitle;
    data.CategoryId = this.blogForm.value.categoryId;
    data.BlogShortContents = this.blogForm.value.blogShortContents;
    if (this.imageToUpload) {
      data.BlogImage = this.imageToUpload;
    } else if (this.imageRemoved) {
      data.RemoveBlogImage = true;
    }
    this.blogService.updateBlog(data).subscribe((res) => {
      if (res && res.succeeded) {
        this.blogForm.reset();
        this.imageToUpload = null;
        this.imageUrl = null;
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
