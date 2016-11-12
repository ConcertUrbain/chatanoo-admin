/* Author:

*/

require.config({
  baseUrl: './js',
  shim: {
    'underscore': { exports: '_' },
    'jquery': { exports: '$' },
    'cookie': { exports: '$', deps: ['jquery'] },
    'jquery-ui': { exports: '$', deps: ['jquery'] },
    'modernizr': { exports: 'Modernizr' },
    'backbone': { deps: ['underscore', 'jquery'], exports: 'Backbone' },
    'bootstrap': { deps: ['jquery'] },
    'chatanoo': { deps: ['underscore', 'jquery'], exports: 'Chatanoo' },
    'gritter': { deps: ['jquery'] },
    'elastic': { deps: ['jquery'] },
    'visualsearch': { deps: ['jquery', 'jquery-ui', 'underscore', 'backbone'] }
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
    'jquery-elastic': 'libs/jquery.elastic-1.6.11.js',
    'modernizr': '../components/modernizr/modernizr',
    'backbone': '../components/backbone/backbone',
    'bootstrap': 'libs/bootstrap.min',
    'chatanoo': 'libs/chatanoo-0.1.0',
    'gritter': '../components/jquery.gritter/js/jquery.gritter',
    'visualsearch': '../components/visualsearch/build/visualsearch',
    'elastic': 'libs/jquery.elastic-1.6.11',

    'config': 'app/config'
  },
  waitSeconds: 45
});

require([
  'jquery',
  'app/app',

  'bootstrap',
  'visualsearch',
  'cookie',
  'gritter',
  'elastic',
  'app/helpers/mixin'
], function($, App) {
  $(document).ready( function() {
    console.log("App loaded");
    App.initialize();
  });
});

window.onerror = function(message, file, line, column, err) {
  console.log('[Error]', err.stack);
}
