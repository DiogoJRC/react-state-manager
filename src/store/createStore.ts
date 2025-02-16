type SetterFn<T> = (prevState: T) => Partial<T>;

export function createStore<TState>(initialState: TState) {
  let state = initialState;
  const listeners = new Set<() => void>();

  function subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  function notifyListeners() {
    listeners.forEach((listener) => listener());
  }

  function setState(partialState: Partial<TState> | SetterFn<TState>) {
    const newValue =
      typeof partialState === 'function' ? partialState(state) : partialState;

    state = {
      ...state,
      ...newValue,
    };

    notifyListeners();
  }

  function getState() {
    return state;
  }

  return { setState, getState, subscribe };
}

// const store = createStore({
//   userName: '',
//   active: false,
//   counter: 1,
// });

// store.subscribe(() => {
//   console.log('Listerner 1', store.getState());
// });

// store.subscribe(() => {
//   console.log('Listerner 2');
// });

// store.setState({ userName: 'Diogo' });

// store.setState((prevState) => ({
//   counter: prevState.counter + 1,
// }));

// store.setState((prevState) => ({
//   counter: prevState.counter + 1,
// }));
