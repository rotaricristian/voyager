import {Action} from '../actions/index';
import {LOG_ERRORS_ADD, LOG_WARNINGS_ADD, LOG_WARNINGS_REMOVE_ALL} from '../actions/log';
import {DEFAULT_LOG, Log} from '../models/log';


export function logReducer(log: Log = DEFAULT_LOG, action: Action): Log {
  switch (action.type) {
    case LOG_ERRORS_ADD:
      const {errors} = action.payload;
      return {
        ...log,
        errors: [...log.errors, ...errors]
      };
    case LOG_WARNINGS_ADD:
      const {warnings} = action.payload;
      return {
        ...log,
        warnings: [...log.warnings, ...warnings]
      };
    case LOG_WARNINGS_REMOVE_ALL:
      return {
        ...log,
        warnings: []
      };
    default:
      return log;
  }
}
