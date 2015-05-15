define([
	'Underscore',
	'Chatanoo',

	'app/collections/abstract',
	
	'app/models/item_model'
], function( _, Chatanoo,
	AbstractCollection,
	Item) {
	
	var Items = AbstractCollection.extend({
    	model: Item,
		badgeName: "items",

		load: function() {
			this.remove(this.toArray());
			
			var mThis = this;
			var r = Chatanoo.items.getItems( {} );
			Chatanoo.items.on( r.success, function(items) {
				_(items).each( function (item) { mThis.push( item ); } );
				mThis.calculate();
				mThis.trigger("load");
			}, this);
		}
	});
	
	return Items
});