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

webpackConfig.module.loaders.unshift(
  {test: /\.jsx?$/, exclude: /(node_modules)|(\.spec\.)/, loader: 'isparta'}
);
webpackConfig.module.loaders.push(
  { test: /\.spec\.jsx?$/, exclude: /(node_modules)/, loader: "babel-loader"}
);

webpackConfig.module.postLoaders = webpackConfig.module.postLoaders || [];
webpackConfig.module.postLoaders.push(
  // delays coverage til after tests are run,
  // fixing transpiled source coverage error
  { test: /\.js$/
  , exclude: /(\.spec\.js)|(node_modules)|(react\.test\.helpers)/
  , loader: 'istanbul-instrumenter'
  }
);



module.exports = function(config) {
  config.set({
    basePath: './client/app'
    , frameworks: ['jasmine']
    , files:
      [ '../function_bind_polyfill.js'
      , '../../node_modules/babel-core/browser-polyfill.js'
      , '../../tests.webpack.js'
    ]
    , exclude: [

    ]
    , preprocessors: {
        // '**/*.spec.jsx': ['webpack']
      // , '**/*.spec.js': ['webpack']
        '../../tests.webpack.js': ['webpack']
      , '**/!(*.spec)+(.js)': ['coverage']
      , '**/!(*.spec)+(.jsx)': ['coverage']
    }
    , webpack: webpackConfig
    , webpackServer: {
      noInfo: true //please don't spam the console when running in karma!
    }
    , reporters: [
        'progress'
      , 'coverage'
      , 'threshold'
    ]
    , coverageReporter: {
      dir: __dirname + '/coverage'
      , reporters: [
          {type: 'html', subdir: 'report-html'}
        , {type: 'cobertura', subdir: 'cobertura/', file: 'cobertura.txt'}
      ]
    }
    , thresholdReporter: {
        statements: 100
      , branches: 100
      , functions: 100
      , lines: 100
    }
    //, junitReporter: {
    //    outputFile: '.tmp/karma-test-results.xml'
    //  , suite: ''
    //}
    , port: 9876
    , colors: true
    // , logLevel: config.LOG_DEBUG
    , logLevel: config.LOG_INFO

    , autoWatch: true
    , singleRun: true
    , browsers: ['PhantomJS']
  });
};
