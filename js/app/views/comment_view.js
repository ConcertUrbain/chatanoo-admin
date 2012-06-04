define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'Config',
	
	'app/views/abstract_row_view',
	
	'text!app/templates/comment.tmpl.html',
	
	'app/views/datas_popin_view',
	'app/views/links_popin_view',
	
	'app/views/app_view'
], function(Backbone, _, $,
	Config,
	AbstractRowView,
	template,
	DatasPopinView, LinksPopinView,
	app_view) {
	
	var CommentView = AbstractRowView.extend({	
		deleteMessage: "Voulez vous vraiment supprimer ce commentaire ?",
    
		events: _.extend( {
    		"click .datas": "showDatas",
			"click .link": "showLinks"
		}, AbstractRowView.prototype.events ),
    
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
		},
		
		showDatas: function( event ) {
			event.preventDefault();
			this.createPopin( DatasPopinView, { model: null, voType: "query", voId: this.model.get('id') } );
		},
		
		showLinks: function( event ) {
			event.preventDefault();
			this.createPopin( LinksPopinView, { model: null, voType: "query", voId: this.model.get('id') } );
		}
	});
	
	return CommentView;
});