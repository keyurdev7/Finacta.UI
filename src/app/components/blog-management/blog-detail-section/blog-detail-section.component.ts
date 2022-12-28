import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Blog } from 'src/app/models/blog.model';
import { Comment } from 'src/app/models/comment.model';
import { User } from 'src/app/models/user.model';
import { BlogService } from 'src/app/shared/services/blog.service';
import { UpdateBlogAction } from 'src/app/store/app.actions';
import { AppState, blogSelector, userSelector } from 'src/app/store/app.state';
import * as commonConstants from 'src/app/shared/constants/common.constant';

@Component({
  selector: 'app-blog-detail-section',
  templateUrl: './blog-detail-section.component.html',
  styleUrls: ['./blog-detail-section.component.scss'],
})
export class BlogDetailSectionComponent implements OnInit, OnDestroy {
  public constants = commonConstants;
  public categories;
  public blog: Blog = new Blog();
  public user: User = new User();
  public comments: Comment[] = [];
  public subscriptions: Subscription[] = [];
  public commentText: string = '';
  public isCommentEdit: boolean = false;
  public editCommentId: number = 0;
  public blogCommentCount: number = 0;
  constructor(
    private blogService: BlogService,
    private router: Router,
    private store: Store<AppState>,
    private toster: ToastrService
  ) {}

  ngOnInit(): void {
    this.subscriptions = [this.subscribeToBlog(), this.subscribeToUser()];
    this.getBlogComments();
  }

  subscribeToBlog(): Subscription {
    return this.store.pipe(blogSelector).subscribe((res) => {
      this.blog = res;
      if (!this.blog.blogId) {
        this.router.navigate(['/blog']);
      }
    });
  }

  subscribeToUser(): Subscription {
    return this.store.pipe(userSelector).subscribe((res) => {
      this.user = res;
    });
  }

  getBlogComments(): void {
    this.blogService.getAllBlogComment(this.blog.blogId).subscribe((res) => {
      this.comments = res.data;
      this.blogCommentCount = this.comments.length;
      if (this.editCommentId) {
        this.scroll(document.getElementById('comment' + this.editCommentId));
        this.editCommentId = 0;
      }
    });
  }

  addComment(): void {
    this.blogService
      .addComment(this.blog.blogId, this.commentText)
      .subscribe((res) => {
        if (res && res.succeeded) {
          this.commentText = '';
          this.toster.success(res.message);
          this.getBlogComments();
        } else if (res && res.errors.length) {
          res.errors.forEach((err) => {
            this.toster.error(err.errorMessage);
          });
        } else if (res && !res.succeeded && res.data) {
          this.toster.error(res.data);
        }
      });
  }

  editComment(comment: Comment, element: HTMLElement): void {
    this.scroll(element);
    element.focus();
    this.isCommentEdit = true;
    this.commentText = comment.comment;
    this.editCommentId = comment.blogCommentId;
  }

  scroll(el: HTMLElement | null) {
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  updateComment(): void {
    this.blogService
      .updateComment(this.editCommentId, this.commentText)
      .subscribe((res) => {
        if (res && res.succeeded) {
          this.commentText = '';
          this.isCommentEdit = false;
          this.toster.success(res.message);
          this.getBlogComments();
        } else if (res && res.errors.length) {
          res.errors.forEach((err) => {
            this.toster.error(err.errorMessage);
          });
        } else if (res && !res.succeeded && res.data) {
          this.toster.error(res.data);
        }
      });
  }

  deleteComment(id: number): void {
    this.blogService.deleteComment(id).subscribe((res) => {
      if (res && res.succeeded) {
        this.commentText = '';
        this.toster.success(res.message);
        this.getBlogComments();
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });
  }

  ngOnDestroy(): void {
    const blogData = new Blog();
    this.subscriptions.forEach((eachSub) => eachSub.unsubscribe());
    this.store.dispatch(UpdateBlogAction(blogData));
  }
}
