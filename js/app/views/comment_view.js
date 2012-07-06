define([
	'Backbone',
	'Underscore',
	'jQuery',
	'Chatanoo',
	
	'Config',
	
	'app/views/abstract_row_view',
	
	'text!app/templates/comment.tmpl.html',
	
	'app/views/datas_popin_view',
	'app/views/links_popin_view',
	
	'app/views/app_view'
], function(Backbone, _, $, Chatanoo,
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
		
		onSelectRow: function() {
			var commentId = this.$el.data('comment-id');
			var itemId = this.$el.data('item-id');
            
			// Timeout for dblclick
			setTimeout( function() {
			var r = Chatanoo.queries.getQueriesByItemId( itemId );
				Chatanoo.queries.on( r.success, function(queries) {
					app_view.chatanoo.loadUrl('/queries/' + queries[0].id + '/items/' + itemId);
				}, this);
			}, 500);
		},
    
		getEditingValue: function() {
			return {
				content: this.$el.find('textarea[name=content]').val()
			};
		},
		
		showDatas: function( event ) {
			event.preventDefault();
			this.createPopin( DatasPopinView, { voType: "Comment", voId: this.model.get('id') } );
		},
		
		showLinks: function( event ) {
			event.preventDefault();
			this.createPopin( LinksPopinView, { voType: "Comment", voId: this.model.get('id') } );
		}
	});
	
	return CommentView;
});