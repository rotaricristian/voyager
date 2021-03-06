import {SHELF_PREVIEW_SPEC, SHELF_PREVIEW_SPEC_DISABLE} from '../actions/shelf-preview';
import {shelfPreviewReducer} from './shelf-preview';

describe('reducers/shelf/spec-preview', () => {
  describe(SHELF_PREVIEW_SPEC, () => {
    it('sets specPreview to be a shelf-spec', () => {
      const specPreview = shelfPreviewReducer({spec: null}, {
        type: SHELF_PREVIEW_SPEC,
        payload: {
          spec: {
            mark: 'bar',
            encoding: {
              x: {field: 'b', type: 'nominal'},
              y: {aggregate: 'count', field: '*', type: 'quantitative'}
            }
          }
        }
      });

      expect(specPreview.spec).toEqual({
        mark: 'bar',
        encoding: {
          x: {field: 'b', type: 'nominal'},
          y: {field: '*', fn: 'count', type: 'quantitative'}
        },
        anyEncodings: [],
        config: undefined,
        filters: []
      });
    });
  });

  describe(SHELF_PREVIEW_SPEC_DISABLE, () => {
    it('sets specPreview to null', () => {
      const specPreview = shelfPreviewReducer({spec: {
        mark: 'bar',
        encoding: {
          x: {field: 'b', type: 'nominal'},
          y: {fn: 'count', field: '*', type: 'quantitative'}
        },
        anyEncodings: [],
        config: undefined,
        filters: []
      }}, {type: SHELF_PREVIEW_SPEC_DISABLE});

      expect(specPreview.spec).toEqual(null);
    });
  });
});
