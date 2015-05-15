define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'Config',
	
	'app/views/abstract_row_view',
	
	'text!app/templates/user.tmpl.html',
	
	'app/views/datas_popin_view',
	'app/views/change_password_popin_view',
	'app/views/links_popin_view',
	'app/views/stats_popin_view',
	'app/views/metas_popin_view',
	
	'app/views/app_view'
], function(Backbone, _, $,
	Config,
	AbstractRowView,
	template,
	DatasPopinView, ChangePasswordPopinView, LinksPopinView, StatsPopinView, MetasPopinView,
	app_view) {
	
	var UserView = AbstractRowView.extend({	
		deleteMessage: "Voulez vous vraiment supprimer cet utilisateur ?",
    
		events: _.extend( {
    		"click .datas": "showDatas",
			"click .pass": "showChangePassword",
			"click .link": "showLinks",
			"click .tags": "showMetas",
			"click .stats": "showStats"
		}, AbstractRowView.prototype.events ),
    
		initialize: function() {
			AbstractRowView.prototype.initialize.call(this);
	    },
    
		render: function() {
			this.$el.data('user-id', this.model.get('id'));
			this.$el.html(_.template( template, { user: this.model, editing: this.editing, Config: Config } ));
    
			AbstractRowView.prototype.render.call(this);
			return this;
		},
		
		onSelectRow: function() {
			var userId = this.$el.data('user-id');
		},
		
		getEditingValue: function() {
			return {
				firstName: this.$el.find('textarea[name=firstName]').val(), 
				lastName: this.$el.find('textarea[name=lastName]').val(), 
				pseudo: this.$el.find('textarea[name=pseudo]').val(), 
				email: this.$el.find('textarea[name=email]').val(), 
				role: this.$el.find('select[name=role]').val()
			};
		},
		
		showDatas: function( event ) {
			event.preventDefault();
			this.createPopin( DatasPopinView, { voType: "User", voId: this.model.get('id') } );
		},
		
		showChangePassword: function( event ) {
			event.preventDefault();
			this.createPopin( ChangePasswordPopinView, { user: this.model } );
		},
		
		showLinks: function( event ) {
			event.preventDefault();
			this.createPopin( LinksPopinView, { voType: "User", voId: this.model.get('id'), vo: this.model } );
		},      

		showMetas: function( event ) {          
			event.preventDefault();             
			this.createPopin( MetasPopinView, { voType: "User", voId: this.model.get('id') } );
		},                                
		                                        
		showStats: function( event ) {          
			event.preventDefault();             
			this.createPopin( StatsPopinView, { voType: "User", voId: this.model.get('id') } );
		}
	});
	
	return UserView;
});