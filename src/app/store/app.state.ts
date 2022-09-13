import { select } from '@ngrx/store';
import { Blog } from '../models/blog.model';
import { User } from '../models/user.model';

export interface AppState {
  user: User;
  blog: Blog;
}

export const userSelector = select((state: AppState) => state.user);
export const blogSelector = select((state: AppState) => state.blog);
