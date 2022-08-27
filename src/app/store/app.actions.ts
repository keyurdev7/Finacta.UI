import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.model';

export const UPDATE_USER = 'update-user';

export const UpdateUserAction = createAction(UPDATE_USER, props<User>());
