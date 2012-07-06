define([
	'Underscore',
	'Chatanoo',

	'app/collections/abstract',
	
	'app/models/data_model'
], function( _, Chatanoo,
	AbstractCollection,
	Data ) {
	
	var Datas = AbstractCollection.extend({
		model: Data,
		isValidKey: null,
		
		datasSet: null,
		
		load: function() {
			if( !_( this.datasSet ).isUsable() )
				return;
			
			var mThis = this;
			this.datasSet.load( function() {
				mThis.trigger("load");
			});
		}
	});
	
	return Datas;
});