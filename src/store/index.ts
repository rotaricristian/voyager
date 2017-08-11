import {applyMiddleware, compose, createStore, Middleware, StoreEnhancer} from 'redux';
import {createLogger} from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import {DEFAULT_STATE, State} from '../models';
import {rootReducer} from '../reducers';

// Imports to satisfy --declarations build requirements
// https://github.com/Microsoft/TypeScript/issues/9944
// tslint:disable-next-line:no-unused-variable
import {Store} from 'redux';
import {createActionLog} from 'redux-action-log';
import {Logger} from '../models/logger';
import {createQueryListener} from './listener';

const loggerMiddleware = createLogger({
  collapsed: true,
  level: 'debug'
});

// define which middleware to use depending on environment
let composeEnhancers = compose;
const middleware: Middleware[] = [thunkMiddleware];

// when not in production enable redux tools and add logger middleware
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  middleware.push(loggerMiddleware);
}

export const localLogger = new Logger();

export let actionLogs: any;

export function configureStore(initialState = DEFAULT_STATE) {
  actionLogs = createActionLog({limit: null});

  const initialStateWithHistory: State = {
    persistent: initialState.persistent,
    undoable: {
      past: [],
      present: initialState.undoable.present,
      future: [],
      _latestUnfiltered: null,
      group: null,
    }
  };

  const store: Store<State> = createStore<State>(
    rootReducer,
    initialStateWithHistory,
    composeEnhancers(applyMiddleware(...middleware), actionLogs.enhancer) as StoreEnhancer<any>
    // HACK: cast to any to supress typescript complaint
  );

  store.subscribe(createQueryListener(store));
  return store;
}
