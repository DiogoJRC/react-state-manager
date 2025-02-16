import { ITodo } from '../entities/ITodo';
import { IUser } from '../entities/IUser';

import { createStore } from './createStore';

interface IGlobalStore {
  user: IUser | null;
  todos: ITodo[];
}

export const globalStore = createStore<IGlobalStore>({
  user: null,
  todos: [],
});
