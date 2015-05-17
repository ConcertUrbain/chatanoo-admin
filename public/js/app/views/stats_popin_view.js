define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'text!app/templates/stats_popin.tmpl.html',
], function(Backbone, _, $,
	template) {
	
	var StatsPopinView = Backbone.View.extend(
	{
		model: null,
		
		events: {
		},
		
		initialize: function() {
			//this.model.on("change", this.render, this);
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
			this.$el.unbind()
			//this.model.off();
			this.$el.remove();
		}
	});
	
	return StatsPopinView;
});