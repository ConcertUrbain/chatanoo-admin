define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'app/views/abstract_table_view',
	
	'Config',
	
	'app/collections/queries',
	'app/views/query_view',
	
	'text!app/templates/queries.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $,
	AbstractTableView,
	Config,
	Queries, QueryView,
	template,
	app_view) {
	
	var QueriesView = AbstractTableView.extend(
	{
		el: $("#content"),
		
		collection: new Queries(),
		voClass: QueryView,
		
		facets: ['id', 'Contenu', 'Description', 'Date d\'ajout', 'Date de modif'],
		
		initialize: function() {
			app_view.chatanoo.loadUrl('/session');
			
			AbstractTableView.prototype.initialize.call(this);
	    },
	
		events: _.extend( AbstractTableView.prototype.events, {
			
		}),
		
		render: function() {
			this.$el.removeClass().addClass('queries');
			
			this.$el.html( _.template( template, { mode: this.mode } ) );
			
			AbstractTableView.prototype.render.call(this);
			return this;
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
		}
	});
	
	return QueriesView;
});