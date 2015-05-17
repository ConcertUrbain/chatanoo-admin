define([
  'Backbone',
  'Underscore',
  'jQuery',
  
  'Config',
  
  'app/views/notifications_view',
  'app/views/connected_view',
  
  'text!app/templates/menu.tmpl.html'
], function(Backbone, _, $,
  Config,
  NotificationsView, ConnectedView,
  template) {
  
  var MenuView = Backbone.View.extend(
  {
    el: $("#menu"),
    
    notificationsView: new NotificationsView(),
    connectedView: new ConnectedView(),
    
    initialize: function() {
      
      },
  
    events: {
      'click li:not(.nav-header)': 'itemClickHandler'
    },
    
    render: function() {
      var mThis = this;
      require(['app/views/app_view'], function(app_view) {
        mThis.$el.html( _.template( template, { nb: app_view.nb } ) );
      });
      this.$el.find('a[href*=' + location.hash.split('/')[1] + ']').parent().addClass('active');
      
      this.$el.append( this.notificationsView.render().$el );
      this.$el.append( this.connectedView.render().$el );
      
      return this;
    },

    itemClickHandler: function( event ) {
      this.$el.find('li.active').removeClass('active');
      
      var item = $( event.currentTarget );
      item.addClass('active');
      location.hash = item.find('a').attr('href');
    },
    
    kill: function() {
      this.$el.unbind()
      //this.model.off();
    }
  });
  
  return MenuView;
});