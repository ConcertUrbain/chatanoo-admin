define([
	'Backbone',
	'Underscore',
	'jQuery',
	'Chatanoo',
	
	'app/views/abstract_table_view',
	
	'Config',
	
	'app/collections/items',
	
	'text!app/templates/items.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $, Chatanoo,
	AbstractTableView,
	Config,
	Items,
	template,
	app_view) {
	
	var ItemsView = AbstractTableView.extend(
	{
		el: $("#content"),
		
		items: new Items(),
		
		initialize: function() {
			app_view.chatanoo.loadUrl('/queries/20');
			
			this.items.loadItems();
			this.items.on('change', function() { this.render(); }, this);
			
			AbstractTableView.prototype.initialize.call(this);
	    },
	
		events: _.extend( AbstractTableView.prototype.events, {
			'click .refresh': 'refresh',
			'click tbody tr': 'selectRow'
		}),
		
		render: function() {
			this.$el.removeClass().addClass('items');
			
			var items;
			switch(this.mode) {
				case "all": items = this.items.all(); break;
				case "valid": items = this.items.valid(); break;
				case "unvalid": items = this.items.unvalid(); break;
			}
			this.$el.html( _.template( template, { items: items, mode: this.mode } ) );
			
			AbstractTableView.prototype.render.call(this);
			return this;
		},
		
		refresh: function( event ) {
			this.items.loadItems();
			return false;
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