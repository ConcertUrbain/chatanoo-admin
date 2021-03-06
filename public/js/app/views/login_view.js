define([
  'backbone',
  'underscore',
  'jquery',

  'app/models/login_model',

  'config',

  'text!app/templates/login.tmpl.html'
], function(Backbone, _, $,
  Login,
  Config,
  template) {

  var LoginView = Backbone.View.extend(
  {
    el: $("#wrapper"),
    template_file: "js/app/views/templates/login.mustache.html",

    initialize: function() {

      },

    model: new Login(),

    events: {
      "change form input[name=login]": "loginChange",
      "change form input[name=session]": "loginChange",
      "change form input[name=password]": "loginChange",
      "click form input[type=submit]": "proccessFrom",

      "click #anonym-connection a": "logAnonymous"
    },

    render: function() {
      this.$el.removeClass().addClass('login-view');
      console.log( Config.sessions );
      this.$el.html( _.template( template, { sessions: Config.chatanoo.sessions } ) );
      return this;
    },

    loginChange: function() {
      this.model.set("session", this.$el.find('select[name=session]').val());
      this.model.set("login", this.$el.find('input[name=login]').val());
      this.model.set("pass", this.$el.find('input[name=password]').val());
    },

    proccessFrom: function() {
      this.model.connect();
      return false;
    },

    logAnonymous: function() {
      this.model.set("login", Config.chatanoo.anonymous_user.login );
      this.model.set("pass", Config.chatanoo.anonymous_user.pass );
      this.model.connect();
      return false;
    },

    kill: function() {
      this.$el.unbind();
      this.$el.removeClass();
      this.$el.html('');
      this.model.off();
    }
  });

  return LoginView;
});
