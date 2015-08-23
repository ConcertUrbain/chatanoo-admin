define([
  'backbone',
  'underscore',
  'jquery',
  'chatanoo',
  'config',

  'app/helpers/metas_typeahead'
], function(Backbone, _, $, Chatanoo, Config, typeahead) {

  var Login = Backbone.Model.extend(
  {
    // Default attributes for the Query item.
    defaults: function() {
      return {
        login: null,
        pass: null
      };
    },

    initialize: function() {

    },

    connect: function() {
      Chatanoo.on('connect', function() {
        window.isLogged = true;
        $.cookie('session_key', Chatanoo.sessionKey, { expires: 7 });

        location.hash = "/dashboard";
      }, this);
      Chatanoo.on('connect:error', function() {
        alert('Identifiant ou mot de passe incorrect.')
      }, this);
      Chatanoo.init(Config.chatanoo.url, this.get("session"));
      Chatanoo.connect(this.get("login"), this.get("pass"));

      var r = Chatanoo.search.getMetas();
      Chatanoo.search.on( r.success, function(metas) {
        typeahead.source.name = _.chain( metas ).pluck('name').uniq().compact().value();
        typeahead.source.content = _.chain( metas ).pluck('content').uniq().compact().value();
      }, this);
    }
  });

  return Login;
});
