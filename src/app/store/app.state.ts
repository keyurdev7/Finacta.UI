import { select } from '@ngrx/store';
import { User } from '../models/user.model';

export interface AppState {
  user: User;
}

export const userSelector = select((state: AppState) => state.user);
