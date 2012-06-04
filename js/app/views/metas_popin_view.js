define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'text!app/templates/metas_popin.tmpl.html',
], function(Backbone, _, $,
	template) {
	
	var MetasPopinView = Backbone.View.extend(
	{
		model: null,
		
		events: {
		},
		
		initialize: function() {
			//this.model.on("change", this.render, this);
			this.$el.addClass("modal hide fade");
	    },
		
		render: function() {
			this.$el.html(_.template( template, { } ));
			
			return this;
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
		}
	});
	
	return MetasPopinView;
});