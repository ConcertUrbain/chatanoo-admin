define([
	'Backbone',
	'Underscore',
	'jQuery',
	'Chatanoo',
	
	'app/views/abstract_table_view',
	
	'Config',
	
	'app/collections/users',
	'app/views/user_view',
	
	'text!app/templates/users.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $, Chatanoo,
	AbstractTableView,
	Config,
	Users, UserView,
	template,
	app_view) {
	
	var UsersView = AbstractTableView.extend(
	{
		el: $("#content"),
		
		users: new Users(),
		
		initialize: function() {
			//app_view.chatanoo.loadUrl('/queries/20');
			
			this.users.loadUsers();
			this.users.on('change', function() { this.render(); }, this);
			
			AbstractTableView.prototype.initialize.call(this);
	    },
	
		events: _.extend( AbstractTableView.prototype.events, {
			'click .refresh': 'refresh',
			'click tbody tr': 'selectRow'
		}),
		
		render: function() {
			this.$el.removeClass().addClass('users');
			
			var users;
			switch(this.mode) {
				case "all": users = this.users.all(); break;
				case "valid": users = this.users.unban(); break;
				case "unvalid": users = this.users.ban(); break;
			}
			this.$el.html( _.template( template, { users: users, mode: this.mode } ) );
			
			var els = [];
			_(users).each( function (user) {
				var uv = new UserView( { model: user } );
				els.push( uv.render().el );
			});
			this.$el.find("table tbody").append( els );
			
			AbstractTableView.prototype.render.call(this);
			return this;
		},
		
		refresh: function( event ) {
			this.users.loadUsers();
			return false;
		},
		
		selectRow: function( event ) {
			var userId = $( event.currentTarget ).data('user-id');
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
		}
	});
	
	return UsersView;
});