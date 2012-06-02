define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'Config',
	
	'text!app/templates/chatanoo.tmpl.html'
], function(Backbone, _, $,
	Config,
	template) {
	
	var ChatanooView = Backbone.View.extend(
	{
		el: $("#chatanoo"),
		
		hash: '',
		
		initialize: function() {
			
	    },
	
		events: {
			"click .retract": "retract",
			"click .deploy": "deploy",
			"click .refresh": "refresh"
		},
		
		render: function() {
			this.$el.html( _.template( template, { config: Config, hash: this.hash } ) );
			return this;
		},
		
		retract: function() {
			require(['app/views/app_view'], function(app_view) {
				app_view.retract();
			});
		},
		
		deploy: function() {
			require(['app/views/app_view'], function(app_view) {
				app_view.deploy();
			});
		},
		
		refresh: function() {
			this.render();
		},
		
		loadUrl: function( url ) {
			this.hash = '#' + url;
			
			var url = Config.chatanoo.iframe + this.hash;
			if( this.$el.find('iframe').attr('src') != url )
				this.$el.find('iframe').attr('src', url);
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
		}
	});
	
	return ChatanooView;
});