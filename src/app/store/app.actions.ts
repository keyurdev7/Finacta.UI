import { createAction, props } from '@ngrx/store';
import { Blog } from '../models/blog.model';
import { Category } from '../models/category.model';
import { StripeKey } from '../models/stripe-key.model';
import { User } from '../models/user.model';
import { Companies } from '../models/companies.model';

export const UPDATE_USER = 'update-user';
export const SET_COMPANIES_KEY = 'set-companies-key';
export const UPDATE_BLOG = 'update-blog';
export const UPDATE_CATEGORY = 'update-category';
export const SET_STRIPE_KEY = 'set-stripe-key';

export const UpdateUserAction = createAction(UPDATE_USER, props<User>());
export const SetCompaniesAction = createAction(
  SET_COMPANIES_KEY,
  props<Companies>()
);
export const UpdateBlogAction = createAction(UPDATE_BLOG, props<Blog>());
export const UpdateCategoryAction = createAction(
  UPDATE_CATEGORY,
  props<Category>()
);
export const SetStripeKeyAction = createAction(
  SET_STRIPE_KEY,
  props<StripeKey>()
);
