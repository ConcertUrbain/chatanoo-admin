define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'text!app/templates/user.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $,
	template,
	app_view) {
	
	var UserView = Backbone.View.extend(
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
			this.$el.html(_.template( template, { user: this.model } ));
			
			return this;
		},
		
		validateQuery: function() {
			this.model.validateUser();
		},
        
		unvalidateQuery: function() {
			this.model.unvalidateUser();
		},
        
		editQuery: function() {
			this.editing = true;
			this.render();
		},
        
		deleteQuery: function() {
			var r = confirm("Voulez vous vraiment supprimer cette contribution ?");
			if( r ) {
				this.model.deleteUser();
			}
		},
		
		//edit
		validateEditQuery: function() {
			this.editing = false;
			this.model.editUser({ 
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
	
	return UserView;
});