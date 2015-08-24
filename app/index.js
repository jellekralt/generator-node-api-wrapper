'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var slugify = require("underscore.string/slugify");

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('Node API Wrapper') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'apiName',
      message: 'The API name'
    },{
      type: 'input',
      name: 'name',
      message: 'The package name',
      default: function(props) {
        return 'node-' + slugify(props.apiName);
      }
    },{
      type: 'input',
      name: 'apiUrl',
      message: 'What is the (production) domain for the API?',
      default: 'api.example.com'
    },{
      type: 'confirm',
      name: 'addServices',
      message: 'Would you like to split up the API methods in separate \'services\' files?',
      default: true
    },{
      type: 'confirm',
      name: 'addAuth',
      message: 'Would you like to add authentication?',
      default: true
    },{
      type: 'list',
      name: 'authType',
      when: function(props) {
        return props.addAuth;
      },
      message: 'What method of authentication does this API use?',
      choices: [
        {
          name: 'OAuth 2.0',
          value: 'oauth2'
        }, {
          name: 'Basic Authentication',
          value: 'basic'
        }
      ]
    }];

    this.prompt(prompts, function (props) {
      this.props = props;

      this.props.packageName = slugify(props.name);
      this.props.apiUrl = props.apiUrl;
      this.props.addServices = props.addServices;
      this.props.addAuth = props.addAuth;
      this.props.authType = props.authType || '';

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this.props
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        this.props
      );
      this.fs.copyTpl(
        this.templatePath('lib/main.js'),
        this.destinationPath('lib/'+ this.props.packageName +'.js'),
        this.props
      )
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  install: function () {
    this.installDependencies();
  }
});
