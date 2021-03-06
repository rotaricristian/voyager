
import {EncodingQuery, isAutoCountQuery, isFieldQuery} from 'compassql/build/src/query/encoding';
import {FieldQuery} from 'compassql/build/src/query/encoding';
import {ExpandedType} from 'compassql/build/src/query/expandedtype';
import {isWildcard, SHORT_WILDCARD, Wildcard, WildcardProperty} from 'compassql/build/src/wildcard';
import {Channel} from 'vega-lite/build/src/channel';
import {Mark as VLMark} from 'vega-lite/build/src/mark';
import {fromFieldQueryFunctionMixins, ShelfFunction, toFieldQueryFunctionMixins} from './function';

export * from './function';

/**
 * Identifier of shelf -- either a channel name for non-wildcard channel or
 * index number for wildcard channel.
 */
export type ShelfId = ShelfChannelId | ShelfWildcardChannelId;

export interface ShelfChannelId {
  channel: Channel;
};

export interface ShelfWildcardChannelId {
  channel: SHORT_WILDCARD | Wildcard<Channel>;
  index: number;
};

export function isWildcardChannelId(shelfId: ShelfId): shelfId is ShelfWildcardChannelId {
  return isWildcard(shelfId.channel);
}

export type ShelfMark = VLMark | SHORT_WILDCARD;

export interface ShelfFieldDef {
  field: WildcardProperty<string>;

  fn?: ShelfFunction | Wildcard<ShelfFunction>;

  type?: ExpandedType;

  title?: string;
}


export interface ShelfAnyEncodingDef extends ShelfFieldDef {
  channel: SHORT_WILDCARD;
}

export type SpecificEncoding = {
  [P in Channel]?: ShelfFieldDef;
};

export function fromEncodingQueries(encodings: EncodingQuery[]): {
  encoding: SpecificEncoding, anyEncodings: ShelfAnyEncodingDef[]
} {
  return encodings.reduce((encodingMixins, encQ) => {
    if (isWildcard(encQ.channel)) {
      encodingMixins.anyEncodings.push({
        channel: encQ.channel,
        ...fromEncodingQuery(encQ)
      });
    } else {
      encodingMixins.encoding[encQ.channel] = fromEncodingQuery(encQ);
    }

    return encodingMixins;
  }, {encoding: {}, anyEncodings: []});
}


export function fromEncodingQuery(encQ: EncodingQuery): ShelfFieldDef {
  if (isFieldQuery(encQ)) {
    return fromFieldQuery(encQ);
  } else if (isAutoCountQuery(encQ)) {
    throw Error('AutoCount Query not yet supported');
  } else {
    throw Error('Value Query not yet supported');
  }
}

export function toEncodingQuery(fieldDef: ShelfFieldDef, channel: Channel | SHORT_WILDCARD): EncodingQuery {
  return toFieldQuery(fieldDef, channel);
}


export function toFieldQuery(fieldDef: ShelfFieldDef, channel: Channel | SHORT_WILDCARD): FieldQuery {
  const {field, fn, type, title: _t} = fieldDef;

  return {
    channel: channel,
    field: field,
    type: type,
    ...toFieldQueryFunctionMixins(fn)
  };
}

export function fromFieldQuery(fieldQ: FieldQuery): ShelfFieldDef {
  const {aggregate, bin, hasFn, timeUnit, field, type} = fieldQ;

  if (isWildcard(type)) {
    throw Error('Voyager does not support wildcard type');
  }

  const fn = fromFieldQueryFunctionMixins({aggregate, bin, timeUnit, hasFn});

  return {
    ...(fn ? {fn} : {}),
    field,
    type
  };
}
