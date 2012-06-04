define([
	'Backbone',
	'Underscore',
	'jQuery',
	'Chatanoo',
	
	'app/views/abstract_table_view',
	
	'Config',
	
	'app/collections/items',
	'app/views/item_view',
	
	'text!app/templates/items.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $, Chatanoo,
	AbstractTableView,
	Config,
	Items, ItemView,
	template,
	app_view) {
	
	var ItemsView = AbstractTableView.extend(
	{
		el: $("#content"),
		
		collection: new Items(),
		voClass: ItemView,
		
		facets: ['id', 'Contenu', 'Description', 'Date d\'ajout', 'Date de modif'],
		
		initialize: function() {
			app_view.chatanoo.loadUrl('/queries/20');
			
			AbstractTableView.prototype.initialize.call(this);
	    },
	
		events: _.extend( {
			'click tbody tr': 'selectRow'
		}, AbstractTableView.prototype.events ),
		
		render: function() {
			this.$el.removeClass().addClass('items');
			
			this.$el.html( _.template( template, { mode: this.mode } ) );
			
			AbstractTableView.prototype.render.call(this);
			return this;
		},
		
		selectRow: function( event ) {
			var itemId = $( event.currentTarget ).data('item-id');
			
			var r = Chatanoo.queries.getQueriesByItemId( itemId );
			Chatanoo.queries.on( r.success, function(queries) {
				app_view.chatanoo.loadUrl('/queries/' + queries[0].id + '/items/' + itemId);
			}, this);
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
		}
	});
	
	return ItemsView;
});