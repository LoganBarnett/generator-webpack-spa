/* flow */

import React from 'react';
import R from 'ramda';
import { renderAndFindOneByDataId } from '../../react.test.utils';
import ObjectTypeEditorContainerFn from './ObjectTypeEditorContainer';

describe('ObjectTypeEditorContainer', () => {
  describe('React component', () => {
    it('renders', () => {
      const { Container } = ObjectTypeEditorContainerFn();
      const html = <Container />;
      const dataId = 'object-type-editor-container';
      const node = renderAndFindOneByDataId(dataId, html);
      expect(node).not.toBe(null);
    });
  });

  describe('mapDispatch', () => {
    it('always provides a value', () => {
      const { mapDispatch } = ObjectTypeEditorContainerFn();
      expect(mapDispatch()).toBeDefined();
    });

    it('always provides an object as its value', () => {
      const { mapDispatch } = ObjectTypeEditorContainerFn();
      expect(mapDispatch()).not.toBe(null);
    });
  });

  describe('mapStateToProps', () => {
    it('always provides a value', () => {
      const { mapStateToProps } = ObjectTypeEditorContainerFn();
      expect(mapStateToProps()).toBeDefined();
    });

    it('always provides an object as its value', () => {
      const { mapStateToProps } = ObjectTypeEditorContainerFn();
      expect(mapStateToProps()).not.toBe(null);
    });
  });
});
