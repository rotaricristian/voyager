import {Schema} from 'compassql/build/src/schema';
import {isWildcard} from 'compassql/build/src/wildcard';
import * as React from 'react';
import * as CSSModules from 'react-css-modules';
import {ConnectDropTarget, DropTarget, DropTargetCollector, DropTargetSpec} from 'react-dnd';
import {ActionHandler} from '../../actions/index';
import {
  SPEC_FIELD_ADD, SPEC_FIELD_MOVE, SPEC_FIELD_REMOVE, SPEC_FUNCTION_ADD_WILDCARD,
  SPEC_FUNCTION_CHANGE, SPEC_FUNCTION_DISABLE_WILDCARD, SPEC_FUNCTION_ENABLE_WILDCARD,
  SPEC_FUNCTION_REMOVE_WILDCARD, SpecEncodingAction
} from '../../actions/shelf';
import {DraggableType, FieldParentType} from '../../constants';
import {ShelfFieldDef, ShelfId} from '../../models';
import {ShelfFunction} from '../../models/shelf';
import {DraggedFieldIdentifier, Field} from '../field/index';
import * as styles from './encoding-shelf.scss';
import {FunctionPicker} from './function-picker';

/**
 * Props for react-dnd of EncodingShelf
 */
export interface EncodingShelfDropTargetProps {
  connectDropTarget: ConnectDropTarget;

  isOver: boolean;

  item: Object;
}

export interface EncodingShelfPropsBase extends ActionHandler<SpecEncodingAction> {
  id: ShelfId;

  fieldDef: ShelfFieldDef;

  schema: Schema;
}

interface EncodingShelfProps extends EncodingShelfPropsBase, EncodingShelfDropTargetProps {};

class EncodingShelfBase extends React.PureComponent<EncodingShelfProps, {}> {

  public render() {
    const {id, connectDropTarget, fieldDef} = this.props;

    const isWildcardShelf = isWildcard(id.channel);
    const channelName = isWildcardShelf ? 'any' : id.channel;

    return connectDropTarget(
      <div styleName={isWildcardShelf ? 'wildcard-shelf' : 'encoding-shelf'}>
        <div styleName="shelf-label">{channelName}</div>
        {fieldDef ? this.field() : this.fieldPlaceholder()}
      </div>
    );
  }

  protected onWildcardEnable() {
    const {id, handleAction} = this.props;

    handleAction({
      type: SPEC_FUNCTION_ENABLE_WILDCARD,
      payload: {
        shelfId: id
      }
    });
  }

  protected onWildcardDisable() {
    const {id, handleAction} = this.props;

    handleAction({
      type: SPEC_FUNCTION_DISABLE_WILDCARD,
      payload: {
        shelfId: id
      }
    });
  }

  protected onWildcardAdd(fn: ShelfFunction) {
    const {id, handleAction} = this.props;
    handleAction({
      type: SPEC_FUNCTION_ADD_WILDCARD,
      payload: {
        shelfId: id,
        fn
      }
    });
  }

  protected onWildcardRemove(fn: ShelfFunction) {
    const {id, handleAction} = this.props;
    handleAction({
      type: SPEC_FUNCTION_REMOVE_WILDCARD,
      payload: {
        shelfId: id,
        fn
      }
    });
  }

  protected onFunctionChange(fn: ShelfFunction) {
    const {id, handleAction} = this.props;
    handleAction({
      type: SPEC_FUNCTION_CHANGE,
      payload: {
        shelfId: id,
        fn: fn
      }
    });
  }

  protected onRemove() {
    const {id, handleAction} = this.props;

    handleAction({
      type: SPEC_FIELD_REMOVE,
      payload: id
    });
  }

  private field() {
    const {id, fieldDef, schema} = this.props;
    const renderFunctionPicker = fieldDef.type === 'quantitative' || fieldDef.type === 'temporal';

    const functionPicker = renderFunctionPicker ?
      <FunctionPicker
        fieldDefParts={fieldDef}
        onFunctionChange={this.onFunctionChange.bind(this)}
        onWildcardEnable={this.onWildcardEnable.bind(this)}
        onWildcardDisable={this.onWildcardDisable.bind(this)}
        onWildcardAdd={this.onWildcardAdd.bind(this)}
        onWildcardRemove={this.onWildcardRemove.bind(this)}
      /> : null;
    return (
      <div styleName='field-wrapper'>
        <Field
          draggable={true}
          fieldDef={fieldDef}
          caretShow={true}
          filterShow={false}
          isPill={true}
          schema={schema}
          popupComponent={functionPicker}
          onRemove={this.onRemove.bind(this)}
          parentId={{type: FieldParentType.ENCODING_SHELF, id: id}}
        />
      </div>
    );
  }

  private fieldPlaceholder() {
    const {item, isOver} = this.props;
    return (
      <span styleName={isOver ? 'placeholder-over' : item ? 'placeholder-active' : 'placeholder'}>
        Drop a field here
      </span>
    );
  }
}

const encodingShelfTarget: DropTargetSpec<EncodingShelfProps> = {
  // TODO: add canDrop
  drop(props, monitor) {
    // Don't drop twice for nested drop target
    if (monitor.didDrop()) {
      return;
    }

    const {fieldDef, parentId} = monitor.getItem() as DraggedFieldIdentifier;
    switch (parentId.type) {
      case FieldParentType.FIELD_LIST:
        props.handleAction({
          type: SPEC_FIELD_ADD,
          // TODO(https://github.com/vega/voyager/issues/428):
          // support inserting a field between two existing fields on the wildcard shelf (replace = false)
          payload: {shelfId: props.id, fieldDef, replace: true}
        });
        break;
      case FieldParentType.ENCODING_SHELF:
        props.handleAction({
          type: SPEC_FIELD_MOVE,
          payload: {from: parentId.id, to: props.id}
        });
        break;
      default:
        throw new Error('Field dragged from unregistered source type to EncodingShelf');
    }
  }
};

const collect: DropTargetCollector = (connect, monitor): EncodingShelfDropTargetProps => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    item: monitor.getItem()
  };
};

// HACK: do type casting to suppress compile error for: https://github.com/Microsoft/TypeScript/issues/13526
export const EncodingShelf: () => React.PureComponent<EncodingShelfPropsBase, {}> =
  DropTarget(DraggableType.FIELD, encodingShelfTarget, collect)(
    CSSModules(EncodingShelfBase, styles)
  ) as any;
