import { useSyncExternalStore } from 'react';

type SetterFn<T> = (prevState: T) => Partial<T>;
type SetStateFn<T> = (partialState: Partial<T> | SetterFn<T>) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createStore<TState extends Record<string, any>>(
  // eslint-disable-next-line no-shadow
  createState: (setState: SetStateFn<TState>) => TState,
) {
  let state: TState;
  let listeners: Set<() => void>;

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

  function useStore<TValue>(
    selector: (currentState: TState) => TValue,
  ): TValue {
    // const [value, setValue] = useState(() => selector(state));

    // useEffect(() => {
    //   const unsubscribe = subscribe(() => {
    //     const newValue = selector(state);

    //     if (value !== newValue) {
    //       setValue(newValue);
    //     }
    //   });
    //   return () => {
    //     unsubscribe();
    //   };
    // }, [selector, value]);

    // return value;

    return useSyncExternalStore(subscribe, () => selector(state));
  }

  state = createState(setState);
  listeners = new Set();

  return { setState, getState, subscribe, useStore };
}
