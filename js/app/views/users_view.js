define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'app/views/abstract_table_view',
	
	'Config',
	
	'text!app/templates/users.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $,
	AbstractTableView,
	Config,
	template,
	app_view) {
	
	var UsersView = AbstractTableView.extend(
	{
		el: $("#content"),
		
		initialize: function() {
			//app_view.chatanoo.loadUrl('/session');
			
			AbstractTableView.prototype.initialize.call(this);
	    },
	
		events: _.extend( AbstractTableView.prototype.events, {
			
		}),
		
		render: function() {
			this.$el.removeClass().addClass('users');
			this.$el.html( _.template( template, {} ) );
			
			AbstractTableView.prototype.render.call(this);
			return this;
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
		}
	});
	
	return UsersView;
});