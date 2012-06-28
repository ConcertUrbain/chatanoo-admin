define([
	'Backbone',
	'Underscore',
	'jQuery',
	'Chatanoo',
	
	'app/views/abstract_table_view',
	
	'Config',
	
	'app/collections/medias',
	'app/views/media_view',
	
	'text!app/templates/medias.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $, Chatanoo,
	AbstractTableView,
	Config,
	Medias, MediaView,
	template,
	app_view) {
	
	var MediasView = AbstractTableView.extend(
	{
		el: $("#content"),
		
		collection: new Medias(),
		voClass: MediaView,
		
		facets: ['id', 'Type', 'Titre', 'Description', 'Url', 'Date d\'ajout', 'Date de modif'],
		
		initialize: function() {
			//app_view.chatanoo.loadUrl('/queries/20');
			
			AbstractTableView.prototype.initialize.call(this);
	    },
	
		events: _.extend( AbstractTableView.prototype.events, {
			
		}),
		
		render: function() {
			this.$el.removeClass().addClass('comments');
			
			this.$el.html( _.template( template, { mode: this.mode } ) );
			
			AbstractTableView.prototype.render.call(this);
			return this;
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
		}
	});
	
	return MediasView;
});