define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'text!app/templates/datas_popin.tmpl.html',
], function(Backbone, _, $,
	template) {
	
	var DatasPopinView = Backbone.View.extend(
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
	
	return DatasPopinView;
});