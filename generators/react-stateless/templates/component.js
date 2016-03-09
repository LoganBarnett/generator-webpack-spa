// @flow
import React from 'react';

const exportFn = () => {
  const Component = (props) => {
    const html = (
      <div data-id="<%= kabobName %>"></div>
    );
    return html;
  };

  return Component;
};

export default exportFn;
