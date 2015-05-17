define([
  'Backbone',
  'Underscore',
  'jQuery',
  
  'Config',
  
  'text!app/templates/connected.tmpl.html'
], function(Backbone, _, $,
  Config,
  template) {
  
  var ConnectedView = Backbone.View.extend(
  {
    initialize: function() {
      
      },
  
    events: {
      
    },
    
    render: function() {
      this.$el.addClass("well menu");
      this.$el.html( _.template( template, {} ) );
      return this;
    },
    
    kill: function() {
      this.$el.unbind()
      //this.model.off();
    }
  });
  
  return ConnectedView;
});