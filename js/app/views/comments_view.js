define([
	'Backbone',
	'Underscore',
	'jQuery',
	'Chatanoo',
	
	'app/views/abstract_table_view',
	
	'Config',
	
	'app/collections/comments',
	'app/views/comment_view',
	
	'text!app/templates/comments.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $, Chatanoo,
	AbstractTableView,
	Config,
	Comments, CommentView,
	template,
	app_view) {
	
	var CommentsView = AbstractTableView.extend(
	{
		el: $("#content"),
		
		comments: new Comments(),
		
		initialize: function() {
			//app_view.chatanoo.loadUrl('/queries/20');
			
			this.comments.loadComments();
			this.comments.on('change', function() { this.render(); }, this);
			
			AbstractTableView.prototype.initialize.call(this);
	    },
	
		events: _.extend( AbstractTableView.prototype.events, {
			'click .refresh': 'refresh',
			'click tbody tr': 'selectRow'
		}),
		
		render: function() {
			this.$el.removeClass().addClass('comments');
			
			var comments;
			switch(this.mode) {
				case "all": comments = this.comments.all(); break;
				case "valid": comments = this.comments.valid(); break;
				case "unvalid": comments = this.comments.unvalid(); break;
			}
			this.$el.html( _.template( template, { comments: comments, mode: this.mode } ) );
			
			var els = [];
			_(comments).each( function (comment) {
				var cv = new CommentView( { model: comment } );
				els.push( cv.render().el );
			});
			this.$el.find("table tbody").append( els );
			
			AbstractTableView.prototype.render.call(this);
			return this;
		},
		
		refresh: function( event ) {
			this.comments.loadComments();
			return false;
		},
		
		selectRow: function( event ) {
			var commentId = $( event.currentTarget ).data('comment-id');
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
	
	return CommentsView;
});