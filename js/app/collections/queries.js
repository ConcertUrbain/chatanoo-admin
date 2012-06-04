define([
	'Underscore',
	'Chatanoo',

	'app/collections/abstract',
	
	'app/models/query_model'
], function( _, Chatanoo,
	AbstractCollection,
	Query) {
	
	var Queries = AbstractCollection.extend({
    	model: Query,

		load: function() {
			this.remove(this.toArray());
			
			var mThis = this;
			var r = Chatanoo.queries.getQueries( {} );
			Chatanoo.queries.on( r.success, function(queries) {
				_(queries).each( function (query) { mThis.push( query ); } );
				mThis.calculate();
				mThis.trigger("load");
			}, this);
		}
	});
	
	return Queries;	
});