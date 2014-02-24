define([
  	'jQuery',
  	'Underscore',
  	'Backbone',
  	'Chatanoo',

	'app/views/app_view'
], function ($, _, Backbone, Chatanoo,
	app_view) {
	
	var AppRouter = Backbone.Router.extend(
	{
	    routes: 
		{
			"login": "login",
			
			"dashboard": "dashboard",
			
			"queries": "queries",
			"items": "items",
			"comments": "comments",
			"medias": "medias",
			"users": "users",
			"tags": "tags",
			
		    "*actions": "defaultRoute" // Backbone will try match the route above first
	    },
	
		app_view: app_view,	
	
		// LOGIN
		login: function()
		{			
			this.app_view.gotoLogin();
		},
		
		dashboard: function()
		{			
			if( this.testConnection() ) {
				this.app_view.gotoDashboard();
			}
		},	
		
		queries: function()
		{			
			if( this.testConnection() ) {
				this.app_view.gotoQueries();
			}
		},
		
		items: function()
		{			
			if( this.testConnection() ) {
				this.app_view.gotoItems();
			}
		},
		
		comments: function()
		{			
			if( this.testConnection() ) {
				this.app_view.gotoComments();
			}
		},
		
		medias: function()
		{			
			if( this.testConnection() ) {
				this.app_view.gotoMedias();
			}
		},
		
		users: function()
		{			
			if( this.testConnection() ) {
				this.app_view.gotoUsers();
			}
		},
		
		tags: function()
		{			
			if( this.testConnection() ) {
				this.app_view.gotoTags();
			}
		},
	
		// DEFAULT
	    defaultRoute: function( actions )
		{
			location.hash = "/login";
	    },
	
		testConnection: function() {
			if(window.isLogged)
				return true;
			
			var session_key = $.cookie('session_key');	
			if( !_.isNull( session_key ) )
			{
				window.isLogged = true;
				Chatanoo.sessionKey = session_key;
				return true;
			}
				
			location.hash = "/login";
			return false;
		}
	});


  	var initialize = function() {
		var instance = new AppRouter;
		instance.testConnection();
		instance.app_view.render();
		
    	Backbone.history.start();
  	};

  	return {
    	initialize: initialize
  	};
});
