import { createAction, props } from '@ngrx/store';
import { Blog } from '../models/blog.model';
import { User } from '../models/user.model';

export const UPDATE_USER = 'update-user';
export const UPDATE_BLOG = 'update-blog';

export const UpdateUserAction = createAction(UPDATE_USER, props<User>());
export const UpdateBlogAction = createAction(UPDATE_BLOG, props<Blog>());
