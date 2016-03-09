/*******************************************************************************
The MIT License (MIT)

Copyright (c) 2015 Logan Barnett (logustus@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*******************************************************************************/
import React from 'react';
import R from 'ramda';
import TestUtils from 'react-addons-test-utils';


// React 0.14 needs a wrapping div to render properly
const wrapHtml = (html) => {
  return (<div>{html}</div>);
};

module.exports =
  { findByDataId: (dataId, markup) => {
    const nodes = TestUtils.findAllInRenderedTree(markup, (n) => {
      return n.getDOMNode().getAttribute('data-id') == dataId;
    });
    return R.head(nodes);
  }
  , findByComponent: (component, markup) => {
    console.log('finding in tree', markup);
    const nodes = TestUtils.findAllInRenderedTree(markup, (n) => {
      if(n != null) {
        console.log('type', n.type);
        console.log('props', n.props);
        console.log('attrs', n.attributes);
      }
      else {
        console.log('n', n);
      }
      return n == component;
    });
    return R.head(nodes);
  }
  , renderAndFindByDataId: (dataId, html) => {
    console.warn('renderAndFindByDataId has been deprecated.');
    console.warn('Use renderAndFindOneByDataId instead.');
    return module.exports.renderAndFindOneByDataId(dataId, html);
  }
  , renderAndFindOneByCss: (css, html) => {
    if(!html) {
      throw 'parameter "html" must be provided';
    }
    const node = TestUtils.renderIntoDocument(wrapHtml(html));
    return node.querySelector(css);
  }
  , renderAndFindOneByDataId: (dataId, html) => {
    const dataIdSelector = '[data-id="' + dataId + '"]';
    return module.exports.renderAndFindOneByCss(dataIdSelector, html);
  }
  , renderAndFindAllByCss: (css, html) => {
    if(!html) {
      throw 'parameter "html" must be provided';
    }
    const node = TestUtils.renderIntoDocument(wrapHtml(html));

    return node.querySelectorAll(css);
  }
  , renderAndFindAllByDataId: (dataId, html) => {
    const dataIdSelector = '[data-id="' + dataId + '"]';
    return module.exports.renderAndFindAllByCss(dataIdSelector, html);
  }
  // No matter what I do, I can't get this to work...
  /*
  , shallowRender: (html) => {
    const shallowRenderer = TestUtils.createRenderer();
    const node = shallowRenderer.getRenderOutput();
    return node;
  }
    */
  , testTextInputRoundTrip: (dataId, html, spy) => {
    const node = module.exports.renderAndFindByDataId(dataId, html);
    TestUtils.Simulate.change(node.getDOMNode(), {target: {value: 'f'}});
    expect(spy).toHaveBeenCalledWith('f');
  }
  , containsClass: (node, className) => {
    return node.getDOMNode().classList.contains(className);
  }
  // mocked components spew out divs whose key is the prop key and
  // whose inner text is the JSON text of the value
  // strings will have double quotes, numbers will be bare, etc
  , mockComponent: (dataId) => {
    return (props) => {
      const getValue = (v) => {
        switch(typeof v) {
          case 'function':
            return v.toString();
          default:
            try {
              return JSON.stringify(v);
            }
            catch(e) {
              // don't know how to handle cyclic structures quickly, so just
              // toString
              return v.toString();
            }
        }
      };
      const pairToDom = ([k, v]) => {
        const text = getValue(v);
        return <div data-id={k} key={k} data-key={k}>{text}</div>;
      };
      const propDivs = R.compose(
          R.map(pairToDom)
        , R.toPairs
      )(props);

      return (
        <span data-id={dataId}>
          {propDivs}
        </span>
      );
    };
  }
};
