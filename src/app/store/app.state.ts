import { select } from '@ngrx/store';
import { Blog } from '../models/blog.model';
import { Category } from '../models/category.model';
import { User } from '../models/user.model';

export interface AppState {
  user: User;
  blog: Blog;
  category: Category;
}

export const userSelector = select((state: AppState) => state.user);
export const blogSelector = select((state: AppState) => state.blog);
export const categorySelector = select((state: AppState) => state.category);
