/* eslint-disable */
module.exports = function(config) {
  config.set({

    files: [
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-route/angular-route.js',
      'client/bower_components/angular-resource/angular-resource.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      'client/bower_components/angular-material/angular-material.js',
      'client/bower_components/angular-animate/angular-animate.js',
      'client/bower_components/angular-aria/angular-aria.js',
      'client/bower_components/hammerjs/hammer.js',
      'client/bower_components/AngularHammer/angular.hammer.js',
      'client/scripts/app.js',
      'client/scripts/directives/pc-zoom*.js',
      'test/client/webdriver/directives/pc-imgresize/style.css',
      'client/scripts/controllers/*.js',
      'client/scripts/services/*.js',
      'test/client/karma/*spec*.js',
      'node_modules/sinon/pkg/sinon-2.4.1.js'
    ],

    autoWatch: true,

    frameworks: ['mocha', 'chai'],

    //browsers: ['Chrome', 'Firefox'],
    // browsers: ['Chrome'],
    // browsers: ['Firefox'],
    browsers: ['PhantomJS'], 
    // browsers: ['FirefoxHeadless'], 
    // customLaunchers: { FirefoxHeadless: 
      // { base: 'Firefox', flags: [ '-headless' ] }
    // } ,
    

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher', 
      'karma-mocha', 'karma-chai'

    //   'karma-junit-reporter'
    ]/*,

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }*/

  });
};
