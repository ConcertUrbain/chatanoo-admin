define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'text!app/templates/item.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $,
	template,
	app_view) {
	
	var ItemView = Backbone.View.extend(
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
			this.$el.data('query-id', this.model.get('id'));
			this.$el.html(_.template( template, { item: this.model } ));
			
			return this;
		},
		
		validateQuery: function() {
			this.model.validateItem();
		},
        
		unvalidateQuery: function() {
			this.model.unvalidateItem();
		},
        
		editQuery: function() {
			this.editing = true;
			this.render();
		},
        
		deleteQuery: function() {
			var r = confirm("Voulez vous vraiment supprimer cette contribution ?");
			if( r ) {
				this.model.deleteItem();
			}
		},
		
		//edit
		validateEditQuery: function() {
			this.editing = false;
			this.model.editItem({ 
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
	
	return ItemView;
});