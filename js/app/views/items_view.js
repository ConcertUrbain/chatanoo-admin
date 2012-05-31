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
		
		items: new Items(),
		
		initialize: function() {
			app_view.chatanoo.loadUrl('/queries/20');
			
			this.items.loadItems();
			this.items.on('change', function() { this.render(); }, this);
			
			AbstractTableView.prototype.initialize.call(this);
	    },
	
		events: _.extend( AbstractTableView.prototype.events, {
			'click .all': 'showAll',
			'click .valid': 'showValid',
			'click .unvalid': 'showUnvalid',
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
			
			var els = [];
			_(items).each( function (item) {
				var iv = new ItemView( { model: item } );
				els.push( iv.render().el );
			});
			this.$el.find("table tbody").append( els );
			
			this.search();
			
			AbstractTableView.prototype.render.call(this);
			return this;
		},
		
		search: function() {
			var mThis = this;
			var visualSearch = VS.init({
	          container  : $('#searchbox'),
	          query      : '',
	          callbacks  : {
				search       : function(query, searchCollection) {
					mThis.items.filters = searchCollection.facets();			
					mThis.render();		
				},
	            facetMatches : function(callback) {
	              callback([
	                'id', 'Titre', 'Description', 'Date d\'ajout', 'Date de modif'
	              ]);
	            },
	            valueMatches : function(facet, searchTerm, callback) {
	              switch (facet) {
	              	/*case 'account':
	                  callback([]);
	                  break;*/
	              }
	            }
	          }
	        });
		},
		
		refresh: function( event ) {
			this.queries.loadQueries();
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