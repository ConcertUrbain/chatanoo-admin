define([
	'Backbone',
	'Underscore',
	'jQuery',
	'Chatanoo',
	
	'app/views/abstract_table_view',
	
	'Config',
	
	'app/collections/medias',
	'app/views/media_view',
	'app/views/add_media_popin',
	
	'text!app/templates/medias.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $, Chatanoo,
	AbstractTableView,
	Config,
	Medias, MediaView, AddMediaPopin,
	template,
	app_view) {
	
	var MediasView = AbstractTableView.extend(
	{
		el: $("#content"),
		
		collection: new Medias(),
		voClass: MediaView,
		addViewClass: AddMediaPopin,
		
		facets: [
			{ label: 'id', 				value: 'id' },
			{ label: 'Type', 			value: 'type' },
			{ label: 'Titre', 			value: 'title' },
			{ label: 'Description', 	value: 'description' },
			{ label: 'Url', 			value: 'url' },
			{ label: 'Date d\'ajout', 	value: 'addDate' },
			{ label: 'Date de modif', 	value: 'setDate' }
		],
		
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