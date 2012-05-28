define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'Config',
	
	'text!app/templates/dashboard.tmpl.html'
], function(Backbone, _, $,
	Config,
	template) {
	
	var DashboadView = Backbone.View.extend(
	{
		el: $("#content"),
		
		initialize: function() {
			
	    },
	
		events: {
		},
		
		render: function() {
			this.$el.removeClass().addClass('dashboard');
			this.$el.html( _.template( template, {} ) );
			return this;
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
		}
	});
	
	return DashboadView;
});