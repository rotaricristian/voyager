import * as React from 'react';
import * as CSSModules from 'react-css-modules';
import {connect} from 'react-redux';
import {LOG_WARNINGS_REMOVE_ALL, LogAction} from '../../actions/log';
import {ActionHandler, createDispatchHandler} from '../../actions/redux-action';
import {State} from '../../models/index';
import {Log} from '../../models/log';
import {selectLog} from '../../selectors/index';
import * as styles from './log-pane.scss';

export interface LogPaneProps extends ActionHandler<LogAction> {
  log: Log;
}

export class LogPaneBase extends React.PureComponent<LogPaneProps, {}> {
  public render() {
    const warnings = this.props.log.warnings;
    const errors = this.props.log.errors;

    const warningPane = warnings.length > 0 ? (
      <div styleName='warning-pane'>
        <a styleName='close' onClick={this.closeWarning.bind(this)}>x</a>
        <ul>
          {warnings.map((warning, index) => {
            return (
              <li key={index}>{warning}</li>
            );
          })}
        </ul>
      </div>
    ) : null;

    const errorPane = errors.length > 0 ? (
      <div styleName='error-pane'>
        <ul>
          {errors.map((error, index) => {
            return (
              <li key={index}>{error}</li>
            );
          })}
        </ul>
      </div>
    ) : null;

    return (
      <div styleName='log-pane-wrapper'>
        {warningPane}
        {errorPane}
      </div>
    );
  }

  protected closeWarning() {
    this.props.handleAction({
      type: LOG_WARNINGS_REMOVE_ALL
    });
  }
}


export const LogPane = connect(
  (state: State) => {
    return {
      log: selectLog(state)
    };
  }, createDispatchHandler<LogAction>())(CSSModules(LogPaneBase, styles));
