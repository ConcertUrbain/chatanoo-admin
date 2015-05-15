define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'Config',
	
	'text!app/templates/notif.tmpl.html'
], function(Backbone, _, $,
	Config,
	template) {
	
	var NotifView = Backbone.View.extend(
	{
		model: null,
		
		initialize: function() {
			
	    },
	
		events: {
			"click .close": "close"
		},
		
		render: function() {
			this.$el.removeClass();
			this.$el.addClass("alert fade in");
			
			switch( this.model.get('type') ) {
				case 'info': this.$el.addClass("alert-info"); break;
				case 'warn': this.$el.addClass("alert-block"); break;
				case 'success': this.$el.addClass("alert-success"); break;
				case 'error': this.$el.addClass("alert-error"); break;
				default: this.$el.addClass("alert-info"); break;
			} 
			
			this.$el.html( _.template( template, { notif: this.model } ) );
			return this;
		},
		
		close: function() {
			this.trigger('delete');
		},
		
		kill: function() {
			this.$el.unbind()
			this.model.off();
		}
	});
	
	return NotifView;
});