import {PlainReduxAction, ReduxAction} from './redux-action';

export type LogAction = LogErrorsAdd | LogWarningsAdd | LogWarningsRemoveAll;

export const LOG_ERRORS_ADD = 'LOG_ERRORS_ADD';
export type LogErrorsAdd = ReduxAction<typeof LOG_ERRORS_ADD, {
  errors: string[]
}>;

export const LOG_WARNINGS_ADD = 'LOG_WARNINGS_ADD';
export type LogWarningsAdd = ReduxAction<typeof LOG_WARNINGS_ADD, {
  warnings: string[]
}>;

export const LOG_WARNINGS_REMOVE_ALL = 'LOG_WARNINGS_REMOVE_ALL';
export type LogWarningsRemoveAll = PlainReduxAction<typeof LOG_WARNINGS_REMOVE_ALL>;
