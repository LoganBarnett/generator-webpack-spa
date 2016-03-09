'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    // var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the astounding ' + chalk.red('generator-webpack-spa') + ' generator!'
    ));

/*
    var prompts = [{
      type: 'confirm',
      name: 'someOption',
      message: 'Would you like to enable this option?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
*/
  },

  writing: function () {

    var filesToCopy =
      [ 'browser-sync.js'
      , 'karma.conf.js',
      , 'package.json'
      , 'react.test.utils.js'
      , 'tests.webpack.js'
      , 'webpack.config.js'
    ];

    var generator = this;
    filesToCopy.forEach(function(file) {
      generator.fs.copy(
        generator.templatePath(file),
        generator.destinationPath(file)
      );
    });
  },

  install: function () {
    this.npmInstall();
  }
});
