define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'Config',
	
	'text!app/templates/menu.tmpl.html'
], function(Backbone, _, $,
	Config,
	template) {
	
	var MenuView = Backbone.View.extend(
	{
		el: $("#menu"),
		
		initialize: function() {
			
	    },
	
		events: {
			'click li li': 'itemClickHandler'
		},
		
		render: function() {
			this.$el.html( _.template( template, {} ) );
			this.$el.find('a[href*=' + location.hash.split('/')[1] + ']').parent().addClass('selected');
			return this;
		},

		itemClickHandler: function( event ) {
			this.$el.find('li.selected').removeClass('selected');
			
			var item = $( event.currentTarget );
			item.addClass('selected');
			location.hash = item.find('a').attr('href');
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
		}
	});
	
	return MenuView;
});