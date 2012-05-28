define([
	'Backbone',
	'Underscore',
	'Chatanoo',
	
	'app/models/item_model'
], function(Backbone, _, Chatanoo,
	Item) {
	
	var Items = Backbone.Collection.extend({
    	model: Item,

		loadItems: function() {
			this.remove(this.toArray());
			
			var mThis = this;
			var r = Chatanoo.items.getItems( {} );
			Chatanoo.items.on( r.success, function(items) {
				_(items).each( function (item) { mThis.push( item ); } );
				mThis.trigger("change");
			}, this);
		},
		
		all: function() {
			return this.toArray();
		},
		
		valid: function() {
			return _(this.toArray()).filter( function(item) {
				return item.get('_isValid');
			});
		},
		
		unvalid: function() {
			return _(this.toArray()).filter( function(item) {
				return !item.get('_isValid');
			});
		}
	});
	
	return Items
});