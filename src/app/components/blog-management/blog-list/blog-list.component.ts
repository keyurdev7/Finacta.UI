import { Component, OnInit } from '@angular/core';
import { Blog } from 'src/app/models/blog.model';
import { BlogService } from 'src/app/shared/services/blog.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit {
  public allBlogs: Blog[] = [];
  categories;
  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.getAllPublishedBlogs();
    this.getPublishedBlogcategories();
  }

  getAllPublishedBlogs(id: number = 0): void {
    this.blogService.getAllPublishedBlogs(id).subscribe((res) => {
      this.allBlogs = res.data;
    });
  }

  getPublishedBlogcategories(): void {
    this.blogService.blogPublishedcategories().subscribe((res) => {
      this.categories = res.data;
    });
  }
}
