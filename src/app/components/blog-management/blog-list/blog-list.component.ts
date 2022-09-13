import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Blog } from 'src/app/models/blog.model';
import { BlogService } from 'src/app/shared/services/blog.service';
import { UpdateBlogAction } from 'src/app/store/app.actions';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit {
  displayedColumns: string[] = ['position'];
  blogDataSource: MatTableDataSource<Blog> = new MatTableDataSource<Blog>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    const categoryId = this.activatedRoute.snapshot.params['id'] || 0;
    this.getAllPublishedBlogs(categoryId);
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
    this.router.navigate(['/blog-detail']);
  }
}
