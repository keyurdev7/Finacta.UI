import { select } from '@ngrx/store';
import { Blog } from '../models/blog.model';
import { Category } from '../models/category.model';
import { StripeKey } from '../models/stripe-key.model';
import { User } from '../models/user.model';

export interface AppState {
  user: User;
  blog: Blog;
  category: Category;
  stripeKey: StripeKey;
}

export const userSelector = select((state: AppState) => state.user);
export const blogSelector = select((state: AppState) => state.blog);
export const categorySelector = select((state: AppState) => state.category);
export const stripeKeySelector = select((state: AppState) => state.stripeKey);
