import React from 'react';
import ComponentFn from './<%= pascalName %>'
import {
  renderAndFindOneByDataId,
  mockComponent,
} from '../../react.test.utils';
import ReactUtils from 'react-addons-test-utils';

describe('<%= pascalName %>', () => {
  const Component = ComponentFn();

  it('renders', () => {
    const html = (
      <Component
      />
    );
    const node = renderAndFindOneByDataId('<%= kabobName %>', html);
    expect(node).not.toBe(null);
  });
});
