import {LOG_ERRORS_ADD, LOG_WARNINGS_ADD, LOG_WARNINGS_REMOVE_ALL} from '../actions/log';
import {DEFAULT_LOG, Log} from '../models/log';
import {logReducer} from './log';

describe('reducers/log', () => {
  describe(LOG_ERRORS_ADD, () => {
    it('should add an error to the existing log', () => {
      const errors = ['this is an error'];
      expect(logReducer(DEFAULT_LOG, {
        type: LOG_ERRORS_ADD,
        payload: {
          errors
        }
      })).toEqual({
        warnings: [],
        errors
      });
    });
  });

  describe(LOG_WARNINGS_ADD, () => {
    it('should add warnings to the existing log', () => {
      const warnings = ['this is the first warning', 'this is the second warning'];
      expect(logReducer(DEFAULT_LOG, {
        type: LOG_WARNINGS_ADD,
        payload: {
          warnings
        }
      })).toEqual({
        warnings,
        errors: []
      });
    });
  });

  describe(LOG_WARNINGS_REMOVE_ALL, () => {
    it('should remove all warnings in the existing log', () => {
      const simpleLog: Log = {
        warnings: ['warning 1', 'warning 2'],
        errors: ['error 1', 'error 2']
      };
      expect(logReducer(simpleLog, {
        type: LOG_WARNINGS_REMOVE_ALL
      })).toEqual({
        ...simpleLog,
        warnings: []
      });
    });
  });
});
