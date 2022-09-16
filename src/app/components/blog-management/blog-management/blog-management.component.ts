import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Blog } from 'src/app/models/blog.model';
import { BlogService } from 'src/app/shared/services/blog.service';
import { AddEditBlogComponent } from '../add-edit-blog/add-edit-blog.component';
import { DeleteBlogConfirmationComponent } from '../delete-blog-confirmation/delete-blog-confirmation.component';
import * as commonConstants from 'src/app/shared/constants/common.constant';

@Component({
  selector: 'app-blog-management',
  templateUrl: './blog-management.component.html',
  styleUrls: ['./blog-management.component.scss'],
})
export class BlogManagementComponent implements OnInit {
  public constants = commonConstants;
  displayedColumns: string[] = [
    'blogTitle',
    'categoryName',
    'publishedDateTime',
    'createdByUserName',
    'action',
  ];
  blogDataSource: MatTableDataSource<Blog> = new MatTableDataSource<Blog>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private blogService: BlogService,
    public dialog: MatDialog,
    public toster: ToastrService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getAllBlogs();
  }

  ngAfterViewInit() {
    this.blogDataSource.paginator = this.paginator;
    this.blogDataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.blogDataSource.filter = filterValue.trim().toLowerCase();

    if (this.blogDataSource.paginator) {
      this.blogDataSource.paginator.firstPage();
    }
  }

  getAllBlogs(): void {
    this.blogService.getAllBlogs().subscribe((res) => {
      this.blogDataSource.data = res.data;
    });
  }

  addBlog(): void {
    const dialog = this.dialog.open(AddEditBlogComponent, {
      minWidth: '50%',
    });
    dialog.afterClosed().subscribe((result) => {
      if (result?.event === 'success') {
        this.getAllBlogs();
      }
      return;
    });
  }

  editBlog(id: number): void {
    const data = this.blogDataSource.data.find((eachData) => eachData.blogId === id);
    const dialog = this.dialog.open(AddEditBlogComponent, {
      minWidth: '50%',
      data
    });
    dialog.afterClosed().subscribe((result) => {
      if (result?.event === 'success') {
        this.getAllBlogs();
      }
      return;
    });
  }

  edit(id: number): void {
    console.log('edit');
  }

  unPublishBlog(id: number): void {
    this.blogService.unPublishBlog(id).subscribe((res) => {
      if (res && res.succeeded) {
        this.toster.success(res.message);
        this.getAllBlogs();
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });
  }

  publishBlog(id: number): void {
    this.blogService.publishBlog(id).subscribe((res) => {
      if (res && res.succeeded) {
        this.toster.success(res.message);
        this.getAllBlogs();
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });
  }

  deleteBlogConfirmation(id: number): void {
    const dialog = this.dialog.open(DeleteBlogConfirmationComponent, {
      minWidth: '28%',
    });
    dialog.afterClosed().subscribe((result) => {
      if (result?.event === 'confirm') {
        this.deleteBlog(id);
      }
      return;
    });
  }

  deleteBlog(id: number): void {
    this.blogService.deleteBlog(id).subscribe((res) => {
      if (res && res.succeeded) {
        this.toster.success(res.message);
        this.getAllBlogs();
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });
  }
}
