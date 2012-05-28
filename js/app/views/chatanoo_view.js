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
		},
		
		render: function() {
			this.$el.html( _.template( template, { config: Config, hash: this.hash } ) );
			return this;
		},
		
		loadUrl: function( url ) {
			this.hash = '#' + url;
			this.render();
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
		}
	});
	
	return ChatanooView;
});