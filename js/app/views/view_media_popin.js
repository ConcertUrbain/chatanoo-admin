define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'text!app/templates/view_media_popin.tmpl.html',
], function(Backbone, _, $,
	template) {
	
	var ViewMediaPopinView = Backbone.View.extend(
	{
		model: null,
		
		events: {
		},
		
		initialize: function() {
			//this.model.on("change", this.render, this);
			var mThis = this;
			this.$el.addClass("modal hide fade view-media");
			this.$el.on('hidden', function () {
			 	mThis.kill();
			});
	    },
		
		render: function() {
			this.$el.html(_.template( template, { } ));
			
			return this;
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
			this.$el.remove();
		}
	});
	
	return ViewMediaPopinView;
});