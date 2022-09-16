import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Blog } from 'src/app/models/blog.model';
import { Category } from 'src/app/models/category.model';
import { BlogService } from 'src/app/shared/services/blog.service';
import {
  UpdateBlogAction,
  UpdateCategoryAction,
} from 'src/app/store/app.actions';
import * as commonConstants from 'src/app/shared/constants/common.constant';
import { AppState, categorySelector } from 'src/app/store/app.state';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit, OnDestroy {
  public constants = commonConstants;
  displayedColumns: string[] = ['position'];
  subscriptions: Subscription[] = [];
  blogDataSource: MatTableDataSource<Blog> = new MatTableDataSource<Blog>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private blogService: BlogService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.subscriptions = [this.subscribeToCategory()];
  }

  subscribeToCategory(): Subscription {
    return this.store.pipe(categorySelector).subscribe((res) => {
      this.getAllPublishedBlogs(
        res ? (res.categoryId ? res.categoryId : 0) : 0
      );
    });
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

  getAllPublishedBlogs(id: number = 0): void {
    this.blogService.getAllPublishedBlogs(id).subscribe((res) => {
      this.blogDataSource.data = res.data;
    });
  }

  readMore(blog: Blog): void {
    this.store.dispatch(UpdateBlogAction(blog));
    this.router.navigate(['/blog/detail']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((eachSub) => eachSub.unsubscribe());
    this.store.dispatch(UpdateCategoryAction(new Category()));
  }
}
