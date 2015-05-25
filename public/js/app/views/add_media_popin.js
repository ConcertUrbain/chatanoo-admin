define([
  'backbone',
  'underscore',
  'jquery',

  'config',

  'text!app/templates/add_media_popin.tmpl.html',
], function(Backbone, _, $,
  Config,
  template) {

  var AddMediaPopinView = Backbone.View.extend(
  {
    events: {
    },

    initialize: function( ) {
      var mThis = this;
      this.$el.addClass("modal hide fade");
      this.$el.on('hidden', function () {
         mThis.kill();
      });
      },

    render: function() {
      this.$el.html(_.template( template, { Config: Config } ));
      return this;
    },

    kill: function() {
      this.$el.unbind();
      //this.model.off();
      this.$el.remove();
    }
  });

  return AddMediaPopinView;
});
