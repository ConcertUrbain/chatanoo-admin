define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'Config',
	
	'text!app/templates/view_media_popin.tmpl.html',
], function(Backbone, _, $,
	Config,
	template) {
	
	var ViewMediaPopinView = Backbone.View.extend(
	{
		model: null,
		
		events: {
		},
		
		initialize: function(options) {
			//this.model.on("change", this.render, this);
			var mThis = this;
			this.$el.addClass("modal hide fade view-media");
			this.$el.on('hidden', function () {
			 	mThis.kill();
			});
			
			this.model = options.media;
	    },
		
		render: function() {
			this.$el.html(_.template( template, { model: this.model, Config: Config } ));
			
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