/* eslint-disable */
module.exports = function(config) {
  config.set({

    basePath: './client',

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-material/angular-material.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/hammerjs/hammer.js',
      'bower_components/AngularHammer/angular.hammer.js',
      'scripts/app.js',
      'scripts/directives/pc-zoom*.js'
    ],

    autoWatch: true,

    frameworks: ['mocha', 'chai'],

    browsers: ['Chrome', 'Firefox'],
    // browsers: ['Chrome'],
    // browsers: ['Firefox'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-mocha', 'karma-chai'

    //   'karma-junit-reporter'
    ]/*,

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }*/

  });
};
