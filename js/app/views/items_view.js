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
		
		facets: [
			{ label: 'id', 				value: 'id' },
			{ label: 'Titre', 			value: 'title' },
			{ label: 'Description', 	value: 'description' },
			{ label: 'Date d\'ajout', 	value: 'addDate' },
			{ label: 'Date de modif', 	value: 'setDate' }
		],
		
		addOption: {
			__className: "Vo_Item"
		},
		
		initialize: function() {
			app_view.chatanoo.loadUrl('/queries/20');
			
			AbstractTableView.prototype.initialize.call(this);
	    },
	
		events: _.extend( {
			
		}, AbstractTableView.prototype.events ),
		
		render: function() {
			this.$el.removeClass().addClass('items');
			
			this.$el.html( _.template( template, { mode: this.mode } ) );
			
			AbstractTableView.prototype.render.call(this);
			return this;
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
		}
	});
	
	return ItemsView;
});