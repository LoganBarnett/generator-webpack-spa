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
'use strict';

/**
 * Require Browsersync along with webpack and middleware for it
 */
var browserSync = require('browser-sync');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

/**
 * Require ./webpack.config.js and make a bundler from it
 */
var webpackConfig = require('./webpack.config');
var bundler = webpack(webpackConfig);

// deferring other requests to the API
// browser-sync must be in the front of any given proxy change (unknown why)
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({
  target: 'http://localhost:9300/'
});
var proxyMiddleware = function(req, res, next) {
  if(req.url.indexOf('/idm-api') == -1) {
    next();
  }
  else {
    proxy.web(req, res);
  }
};


/**
 * Run Browsersync and use middleware for Hot Module Replacement
 */
browserSync({
  server: {
    baseDir: 'dist'
    , middleware: [
      webpackDevMiddleware(bundler, {
        // IMPORTANT: dev middleware can't access config, so we should
        // provide publicPath by ourselves
        publicPath: webpackConfig.output.publicPath

        // pretty colored output
        , stats: { colors: true }

        , noInfo: true

        // for other settings see
        // http://webpack.github.io/docs/webpack-dev-middleware.html
      })

      // bundler should be the same as above
      , webpackHotMiddleware(bundler)
    ]
  }
  // don't open the browser on start
  , open: false
  // no need to watch '*.js' here, webpack will take care of it for us,
  // including full page reloads if HMR won't work
  , files: [
    'client/css/*.css',
    'client/*.html'
  ]
});
