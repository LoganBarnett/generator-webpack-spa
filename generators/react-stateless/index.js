const generators = require('yeoman-generator');
const Case = require('case');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);
    this.argument('component-name', { type: String, required: true });
  },
  writing: function() {
    const implFileName = this['component-name'] + '.js';
    const testFileName = this['component-name'] + '.spec.js';
    const kabobName = Case.kebab(this['component-name']);
    const pascalName = Case.pascal(this['component-name']);
    const templateMapping = { kabobName, pascalName };

    console.log(templateMapping);
    this.fs.copyTpl(
      this.templatePath('component.js'),
      this.destinationPath('client/components/' + implFileName),
      templateMapping
    );

    this.fs.copyTpl(
      this.templatePath('component.spec.js'),
      this.destinationPath('client/components/' + testFileName),
      templateMapping
    );
  },
});
