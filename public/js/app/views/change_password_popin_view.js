define([
  'backbone',
  'underscore',
  'jquery',
  'chatanoo',

  'text!app/templates/change_password.tmpl.html',
], function(Backbone, _, $, Chatanoo,
  template) {

  var ChangePasswordPopinView = Backbone.View.extend(
  {
    model: null,
    user: null,

    events: {
      "submit #change-password-form": "proccessForm",
      "click .validate": "proccessForm"
    },

    initialize: function(options) {
      this.user = options.user;

      var mThis = this;
      this.$el.addClass("modal hide fade");
      this.$el.on('hidden', function () {
         mThis.kill();
      });
      },

    render: function() {
      this.$el.html(_.template( template, { } ));

      return this;
    },

    proccessForm: function( event ) {
      event.preventDefault();

      var password = this.$el.find('input[name=password]');
      var confirm = this.$el.find('input[name=confirm]');

      password.parent().parent().removeClass('error');
      confirm.parent().parent().removeClass('error')

      if( password.val() == confirm.val() && password.val() != "") {
        var r = Chatanoo.users.setUserPassword( this.user.get("id"), password.val() );
        Chatanoo.users.on( r.success, function( userId ) {
          this.$el.modal('hide');
          this.trigger("change change:password");
        }, this);
      } else {
        password.parent().parent().addClass('error');
        confirm.parent().parent().addClass('error');
      }

      return false;
    },

    kill: function() {
      this.$el.unbind();
      this.$el.remove();
      //this.model.off();
    }
  });

  return ChangePasswordPopinView;
});
