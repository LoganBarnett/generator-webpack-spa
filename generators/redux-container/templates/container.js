/* flow */
import React from 'react';
import R from 'ramda';

const exportFn = () => {
  const Container = () => {
    const html = <div data-id="<%= kabobName %>"></div>;
    return html;
  };

  const mapDispatch = () => ({});

  const mapStateToProps = (state) => {
    const newState = {};

    return newState;
  };

  const requireObj = { Container, mapStateToProps, mapDispatch };
  return requireObj;
};

module.exports = exportFn;
