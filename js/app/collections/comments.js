define([
	'Backbone',
	'Underscore',
	'Chatanoo',
	
	'app/models/comment_model'
], function(Backbone, _, Chatanoo,
	Comment) {

	var Comments = Backbone.Collection.extend({
    	model: Comment,

		filters: [],

		loadComments: function() {
			this.remove(this.toArray());
			
			var mThis = this;
			var r = Chatanoo.comments.getComments( {} );
			Chatanoo.comments.on( r.success, function(comments) {
				_(comments).each( function (comment) { mThis.push( comment ); } );
				mThis.trigger("change");
			}, this);
		},
		
		all: function() {
			return this.toArray();
		},
		
		valid: function() {
			return _(this.toArray()).filter( function(comment) {
				return parseInt( comment.get('_isValid') );
			});
		},
		
		unvalid: function() {
			return _(this.toArray()).filter( function(comment) {
				return !parseInt( comment.get('_isValid') );
			});
		}
	});
	
	return Comments;
});