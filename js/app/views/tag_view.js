define([
	'Backbone',
	'Underscore',
	'jQuery',
	'Chatanoo',
	
	'Config',
	
	'app/views/abstract_row_view',
	
	'text!app/templates/tag.tmpl.html',

	'app/views/links_popin_view',
	
	'app/views/app_view'
], function(Backbone, _, $, Chatanoo,
	Config,
	AbstractRowView,
	template,
	LinksPopinView,
	app_view) {
	
	var TagView = AbstractRowView.extend({	
		deleteMessage: "Voulez vous vraiment supprimer ce tag ?",
    
		events: _.extend( {
			"click .link": "showLinks"
		}, AbstractRowView.prototype.events ),
    
		initialize: function() {
			AbstractRowView.prototype.initialize.call(this);
	    },
    
		render: function() {
			this.$el.data('tag-id', this.model.get('id'));
			this.$el.html(_.template( template, { tag: this.model, editing: this.editing, Config: Config } ));
    
			AbstractRowView.prototype.render.call(this);
			return this;
		},
		
		onSelectRow: function() {
			var itemId = this.$el.data('tag-id');
			
			// Timeout for dblclick
			// setTimeout( function() {
			// 	var r = Chatanoo.queries.getQueriesByItemId( itemId );
			// 	Chatanoo.queries.on( r.success, function(queries) {
			// 		app_view.chatanoo.loadUrl('/queries/' + queries[0].id + '/items/' + itemId);
			// 	}, this);
			// }, 500);
		},
    
		getEditingValue: function() {
			return {
				name: this.$el.find('textarea[name=name]').val(), 
				content: this.$el.find('textarea[name=content]').val()
			};
		},                                   
		                                        
		showLinks: function( event ) {          
			event.preventDefault();             
			this.createPopin( LinksPopinView, { voType: "Meta", voId: this.model.get('id'), vo: this.model } );
		}
	});
	
	return TagView;
});