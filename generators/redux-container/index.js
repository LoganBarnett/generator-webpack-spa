const generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);
    this.argument('container-name', { type: String, required: true });
  },
  writing: function() {
    const implFileName = this['container-name'] + '.js';
    const testFileName = this['container-name'] + '.spec.js';
    const kabobName = this['container-name'];
    this.fs.copyTpl(
      this.templatePath('container.js'),
      this.destinationPath('client/containers/' + implFileName),
      { containerName: kabobName, kabobName }
    );

    this.fs.copyTpl(
      this.templatePath('container.spec.js'),
      this.destinationPath('client/containers/' + testFileName),
      { containerName: kabobName, kabobName }
    );
  },
});
