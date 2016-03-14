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
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var cssNext = require('cssnext');
var fs = require('fs');
var process = require('process');

// console.log(process.env);
// var env = process.env.APP_RUNTIME_MODE || 'DEV';
var getEnv = function(task) {
  switch(task) {
    case 'bs':
      return 'DEV';
    case 'test-watch':
    case 'test':
      return 'TEST';
    default:
      return 'PRODUCTION';
  }
};

/* eslint disable no-process-env */
var env = getEnv(process.env.npm_lifecycle_event);

var localCssName = '[name]__[local]___[hash:base64:5]';

var eslint = {
  test: /\.jsx?$/,
  loaders: [ 'eslint' ],
  exclude: /(node_modules)/,
};

var loaders =
  [ { loader: ExtractTextPlugin.extract(
        'style'
      , 'css?modules&importLoaders=1&localIdentName=' + localCssName +'!postcss'
    )
    , test: /\.css$/
  }
  , { test: /\.jsx?$/
    , exclude: /(node_modules)|(\.spec\.jsx?$)|(tests\.webpack\.js)|(sub\.js)/
    , loaders: [
      'babel?presets[]=es2015&presets[]=react',
      'flowcheck',
      // not sure why this must be repeated
      // necessary so flowcheck doesn't blow up on es6 syntax
      'babel?presets[]=es2015&presets[]=react',
    ]
  }
  , { test   : /\.woff|\.woff2|\.svg|.eot|\.ttf/
  // , { test   : /\.(woff|woff2|ttf|eot|svg)(\?]?.*)?$/
    , loader : 'url?prefix=font/&limit=1000&mimetype=image/svg+xml'
  }
];

var entries = [
  // 'babel-core/polyfill',
  './index',
];

var plugins =
  [ new webpack.DefinePlugin({__ENV__: '\'' + env + '\''})
  // , new webpack.ProvidePlugin({'config': 'config'})
  , new webpack.optimize.OccurenceOrderPlugin()
  , new webpack.NoErrorsPlugin()
  , new ExtractTextPlugin('bundle.css', { allChunks: true })
    // keep this handy in case we introduce filename hashing again
    /*
      function() {
      this.plugin('done', function(stats) {
        console.log('plugin done');
        var hash = stats.hash;
        var fs = require('fs');
        var fileData = fs.readFileSync('dist/index.html', {encoding: 'utf8'});
        var output = fileData.replace('index.min.js', 'index.' + hash + '.min.js');
        fs.writeFileSync('dist/index.html', output);
      });
    }
    */
];

var devtool = null;
var preLoaders = [];
var uglifyOpts = { comments: false };
// apply env-specific changes to the build pipeline
// order is very important in here, hence the unshifts/splices/etc
console.log('env is ' + env);
if(env == 'DEV') {
  devtool = '#eval-sourc-map';
  preLoaders.push(eslint);
  loaders[1].loaders.unshift('react-hot');

  entries.splice(1, 0
    , 'webpack/hot/dev-server'
    , 'webpack-hot-middleware/client'
  );

  plugins.unshift(new webpack.HotModuleReplacementPlugin());
}
else if(env == 'TEST') {
  devtool = '#eval-sourc-map';
}
else {
  devtool = 'source-map';
  preLoaders.push(eslint);
  var uglifyOpts = {comments: false};
  // plugins.push(new webpack.optimize.UglifyJsPlugin({output: uglifyOpts}));
  plugins.push(new webpack.optimize.UglifyJsPlugin(uglifyOpts));
  plugins.push(new webpack.optimize.DedupePlugin());
}

module.exports = {
    devtool: devtool
  , context: path.join(__dirname, 'client')
  , entry: entries
  , output: {
      filename: 'bundle.js'
    , path: path.join(__dirname, 'dist')
    , publicPath: '/' // default but need to provide value for browser-sync
    , libraryTarget: 'var'
    , library: 'config'
  }
  , externals:
    { window: 'window'
    , config: 'config'
  }
  , plugins: plugins
  , module: {
    loaders: loaders
  }
  , postcss: function() {
    var varPath =
      path.join(__dirname, 'client', 'app', 'containers', 'vars.json');
    var vars = JSON.parse(fs.readFileSync(varPath));
    return [cssNext(vars)];
  }
};
