/* Author:

*/

require.config({
  baseUrl: './js',
  shim: {
    'underscore': { exports: '_' },
    'jquery': { exports: '$' },
    'cookie': { exports: '$', deps: ['jquery'] },
    // 'jquery-ui': { exports: '$', deps: ['jquery'] },
    'modernizr': { exports: 'Modernizr' },
    'backbone': { deps: ['underscore', 'jquery'], exports: 'Backbone' },
    'bootstrap': { deps: ['jquery'] },
    'chatanoo': { deps: ['underscore', 'jquery'], exports: 'Chatanoo' },
    'gritter': { deps: ['jquery'] },
    'elastic': { deps: ['jquery'] },
    'visualsearch': { deps: ['jquery', /*'jquery-ui', */'underscore', 'backbone'] },
    'aws': { exports: 'AWS' }
  },
  paths: {
    'text': '../components/requirejs-text/text',
    'json': '../components/requirejs-plugins/src/json',
    'dom-ready': '../components/requirejs-domready/domReady',

    'underscore': '../components/underscore/underscore',
    'jquery': '../components/jquery/jquery',
    'cookie': '../components/jquery.cookie/jquery.cookie',
    'moment': '../components/moment/moment',
    'jquery-ui': 'libs/jquery-ui-1.8.20.custom.min',
    'elastic': 'libs/jquery.elastic-1.6.11.js',
    'modernizr': '../components/modernizr/modernizr',
    'backbone': '../components/backbone/backbone',
    'bootstrap': 'libs/bootstrap.min',
    'chatanoo': 'libs/chatanoo-0.1.0',
    'gritter': '../components/jquery.gritter/js/jquery.gritter',
    'visualsearch': '../components/visualsearch/build/visualsearch',
    'elastic': 'libs/jquery.elastic-1.6.11',
    'aws': '../components/aws-sdk-js/dist/aws-sdk',

    'config': 'app/config'
  },
  waitSeconds: 45
});

require([
  'jquery',
  'aws',
  'config',
  'app/app',

  'bootstrap',
  'visualsearch',
  'cookie',
  'gritter',
  'elastic',
  'app/helpers/mixin'
], function($, aws, Config, App) {
  $(document).ready( function() {

    console.log("App loaded");
    App.initialize();

    aws.config.update({
      region: 'eu-west-1',
      accessKeyId: 'AKIAIXCXYCP6KQKXWXNQ',
      secretAccessKey: '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'
    });
    var cloudwatchlogs = new AWS.CloudWatchLogs({
      apiVersion: '2014-03-28'
    });

    var token = "49543063142833479438792691369440060137384119169038946050";
    window.onerror = function(message, file, line, column, err) {
      var params = {
        logEvents: [{
            message: '[Error] ' + err.stack,
            timestamp: new Date().getTime()
        }],
        logGroupName: 'chatanoo-admin-prod-browser',
        logStreamName: 'browser', //navigator.userAgent
        sequenceToken: token
      };
      cloudwatchlogs.putLogEvents(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     token = data.nextSequenceToken;
      });
    }

    // foo();

  });
});


