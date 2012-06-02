define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'Config',
	
	'app/views/abstract_row_view',
	
	'text!app/templates/comment.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $,
	Config,
	AbstractRowView,
	template,
	app_view) {
	
	var CommentView = AbstractRowView.extend({	
		deleteMessage: "Voulez vous vraiment supprimer ce commentaire ?",
    
		events: _.extend( AbstractRowView.prototype.events, {
    
		}),
    
		initialize: function() {
			AbstractRowView.prototype.initialize.call(this);
	    },
    
		render: function() {
			this.$el.data('comment-id', this.model.get('id'));
			this.$el.html(_.template( template, { comment: this.model, editing: this.editing, Config: Config } ));
    
			AbstractRowView.prototype.render.call(this);
			return this;
		},
    
		getEditingValue: function() {
			return {
				content: this.$el.find('textarea[name=content]').val()
			};
		}
	});
	
	return CommentView;
});