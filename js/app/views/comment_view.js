define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'text!app/templates/comment.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $,
	template,
	app_view) {
	
	var CommentView = Backbone.View.extend(
	{
		tagName: "tr",
		
		model: null,
		editing: false,
		
		events: {
		},
		
		initialize: function() {
			this.model.on("change", this.render, this);
	    },
		
		render: function() {
			this.$el.data('comment-id', this.model.get('id'));
			this.$el.html(_.template( template, { comment: this.model } ));
			
			return this;
		},
		
		validateQuery: function() {
			this.model.validateComment();
		},
        
		unvalidateQuery: function() {
			this.model.unvalidateComment();
		},
        
		editQuery: function() {
			this.editing = true;
			this.render();
		},
        
		deleteQuery: function() {
			var r = confirm("Voulez vous vraiment supprimer ce commentaire ?");
			if( r ) {
				this.model.deleteComment();
			}
		},
		
		//edit
		validateEditQuery: function() {
			this.editing = false;
			this.model.editComment({ 
				//content: this.$el.find('textarea').val() 
			});
		},
		
		cancelEditQuery: function() {
			this.editing = false;
			this.render();
		},
		
		kill: function() {
			this.$el.unbind()
			this.model.off();
		}
	});
	
	return CommentView;
});