define([
  'jquery',
  'underscore',
  'backbone',
  'chatanoo',
  'app/router',

  'config',

  'moment'
], function($, _, Backbone, Chatanoo, Router, Config, moment) {
    var initialize = function() {
      // Chatanoo.init(Config.chatanoo.url, Config.chatanoo.api_key);
      moment.lang("fr");

      window.isLogged = false;

      Config.load( function() {
        Router.initialize();
      });
    }

    return {
      initialize: initialize
    };
});
