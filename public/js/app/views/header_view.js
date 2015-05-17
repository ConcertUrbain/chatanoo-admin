define([
  'Backbone',
  'Underscore',
  'jQuery',
  
  'Config',
  
  'app/helpers/create_popin',
  
  'app/views/profil_popin_view',
  'app/views/search_popin_view',
  
  'text!app/templates/header.tmpl.html'
], function(Backbone, _, $,
  Config,
  createPopin,
  ProfilPopinView, SearchPopinView,
  template) {
  
  var HeaderView = Backbone.View.extend(
  {
    el: $("#header"),
    
    model: null,
    
    events: {
      "click .logout": "logout",
      "click .profil": "profil",
      "submit .navbar-search": "search"
    },
    
    initialize: function() 
      {
        this.model.on("change", this.render, this);
      },
    
    render: function() 
    {
      var mThis = this;
      require(['app/views/app_view'], function(app_view) {
        mThis.$el.html( _.template( template, { model: mThis.model ? mThis.model.toJSON() : {}, config: Config, user: app_view.user } ) );
      });
      
      return this;
    },
    
    logout: function() {
      require(['app/views/app_view'], function(app_view) {
        $.cookie('session_key', null);
        app_view.user = null;
        location.hash = "/login";
      });
      return false;
    },
    
    profil: function() {
      require(['app/views/app_view'], function(app_view) {
        createPopin( ProfilPopinView, { user: app_view.user } );
      });
      return false;
    },
    
    search: function() {
      createPopin( SearchPopinView, {} );
      return false;
    },

    kill: function() {
      this.$el.unbind()
      this.model.off();
    }
  });
  
  return HeaderView;
});