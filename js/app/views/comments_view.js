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
		
		collection: new Comments(),
		voClass: CommentView,
		
		facets: ['id', 'Contenu', 'Date d\'ajout', 'Date de modif'],
		
		initialize: function() {
			//app_view.chatanoo.loadUrl('/queries/20');
			
			AbstractTableView.prototype.initialize.call(this);
	    },
	
		events: _.extend( AbstractTableView.prototype.events, {
			
		}),
		
		render: function() {
			this.$el.removeClass().addClass('comments');
			
			this.$el.html( _.template( template, { mode: this.mode } ) );
			
			AbstractTableView.prototype.render.call(this);
			return this;
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
		}
	});
	
	return CommentsView;
});