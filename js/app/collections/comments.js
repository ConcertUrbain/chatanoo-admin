define([
	'Underscore',
	'Chatanoo',
	
	'app/collections/abstract',
	
	'app/models/comment_model'
], function( _, Chatanoo,
	AbstractCollection,
	Comment) {

	var Comments = AbstractCollection.extend({
    	model: Comment,
		
		load: function() {
			this.remove(this.toArray());
			
			var mThis = this;
			var r = Chatanoo.comments.getComments( {} );
			Chatanoo.comments.on( r.success, function(comments) {
				_(comments).each( function (comment) { mThis.push( comment ); } );
				mThis.calculate();
				mThis.trigger("change");
			}, this);
		}
	});
	
	return Comments;
});