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
			'click tbody tr': 'selectRow'
		}),
		
		render: function() {
			this.$el.removeClass().addClass('comments');
			
			this.$el.html( _.template( template, { mode: this.mode } ) );
			
			AbstractTableView.prototype.render.call(this);
			return this;
		},
		
		selectRow: function( event ) {
			var mediaId = $( event.currentTarget ).data('media-id');
			var mediaType = $( event.currentTarget ).data('media-type');
			//app_view.chatanoo.loadUrl('/queries/' + queryId);
			
			var r = Chatanoo.items.getItemsByMediaId( mediaId, mediaType );
			Chatanoo.items.on( r.success, function(items) {
				var itemId = items[0].id;
				
				var r = Chatanoo.queries.getQueriesByItemId( itemId );
				Chatanoo.queries.on( r.success, function(queries) {
					app_view.chatanoo.loadUrl('/queries/' + queries[0].id + '/items/' + itemId);
				}, this);
			}, this);
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
		}
	});
	
	return MediasView;
});