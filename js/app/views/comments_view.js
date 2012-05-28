define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'app/views/abstract_table_view',
	
	'Config',
	
	'app/collections/comments',
	
	'text!app/templates/comments.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $,
	AbstractTableView,
	Config,
	Comments,
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
			
			AbstractTableView.prototype.render.call(this);
			return this;
		},
		
		refresh: function( event ) {
			this.comments.loadComments();
			return false;
		},
		
		selectRow: function( event ) {
			var commentId = $( event.currentTarget ).data('comment-id');
			//app_view.chatanoo.loadUrl('/queries/' + queryId);
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
		}
	});
	
	return CommentsView;
});