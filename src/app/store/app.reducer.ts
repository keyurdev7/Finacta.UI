import * as AppActions from 'src/app/store/app.actions';
import { ActionReducer, createReducer, INIT, on } from '@ngrx/store';
import { User } from '../models/user.model';
import { AppState } from './app.state';
import { Blog } from '../models/blog.model';

export const hydrationMetaReducer = (
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> => {
  return (state, action) => {
    if (action.type === INIT) {
      const storageValue = localStorage.getItem('state');
      if (storageValue) {
        try {
          return JSON.parse(storageValue);
        } catch {
          localStorage.removeItem('state');
        }
      }
    }
    const nextState = reducer(state, action);
    localStorage.setItem('state', JSON.stringify(nextState));
    return nextState;
  };
};

export const userReducer = createReducer(
  new User(),
  on(AppActions.UpdateUserAction, (state, user) => user)
);
export const blogReducer = createReducer(
  new Blog(),
  on(AppActions.UpdateBlogAction, (state, blog) => blog)
);
