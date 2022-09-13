import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/shared/services/blog.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-blog-sidebar',
  templateUrl: './blog-sidebar.component.html',
  styleUrls: ['./blog-sidebar.component.scss'],
})
export class BlogSidebarComponent implements OnInit {
  public categories;
  @Output() categorySelected = new EventEmitter<number>();
  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.getPublishedBlogcategories();
  }

  getAllPublishedBlogs(id): void {
    this.categorySelected.emit(id);
  }

  getPublishedBlogcategories(): void {
    this.blogService.blogPublishedcategories().subscribe((res) => {
      this.categories = res.data;
    });
  }
}
