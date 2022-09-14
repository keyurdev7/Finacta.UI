import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/shared/services/blog.service';
import { Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { UpdateCategoryAction } from 'src/app/store/app.actions';
import { Category } from 'src/app/models/category.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-sidebar',
  templateUrl: './blog-sidebar.component.html',
  styleUrls: ['./blog-sidebar.component.scss'],
})
export class BlogSidebarComponent implements OnInit {
  public categories;
  @Output() categorySelected = new EventEmitter<number>();
  constructor(
    private blogService: BlogService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPublishedBlogcategories();
  }

  getAllPublishedBlogs(category: Category = new Category()): void {
    this.store.dispatch(UpdateCategoryAction(category));
    this.router.navigate(['/blog']);
  }

  getPublishedBlogcategories(): void {
    this.blogService.blogPublishedcategories().subscribe((res) => {
      this.categories = res.data;
    });
  }
}
