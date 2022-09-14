import { createAction, props } from '@ngrx/store';
import { Blog } from '../models/blog.model';
import { Category } from '../models/category.model';
import { User } from '../models/user.model';

export const UPDATE_USER = 'update-user';
export const UPDATE_BLOG = 'update-blog';
export const UPDATE_CATEGORY = 'update-category';

export const UpdateUserAction = createAction(UPDATE_USER, props<User>());
export const UpdateBlogAction = createAction(UPDATE_BLOG, props<Blog>());
export const UpdateCategoryAction = createAction(UPDATE_CATEGORY, props<Category>());
