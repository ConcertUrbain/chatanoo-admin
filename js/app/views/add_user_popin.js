define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'Config',
	
	'text!app/templates/add_user_popin.tmpl.html',
], function(Backbone, _, $,
	Config,
	template) {
	
	var AddUserPopinView = Backbone.View.extend(
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
			this.$el.html(_.template( template, { } ));
			return this;
		},
		
		kill: function() {
			this.$el.unbind();
			//this.model.off();
			this.$el.remove();
		}
	});
	
	return AddUserPopinView;
});