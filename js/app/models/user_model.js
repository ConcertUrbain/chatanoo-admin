define([
	'Backbone',
	'Underscore',
	'Chatanoo'
], function(Backbone, _, Chatanoo) {
	
	var User = Backbone.Model.extend(
	{
	    // Default attributes for the Query item.
	    defaults: function() {
	      return {};
	    },
	
	    initialize: function() {
		
	    },
		
		unbanUser: function() {
			var r = Chatanoo.users.banUser( this.get("id"), false );
			Chatanoo.users.on( r.success, function( userId ) {
				this.trigger("change change:validate");
				this.set('_isValid', 1);
			}, this);
		},
		
		banUser: function() {
			var r = Chatanoo.users.banUser( this.get("id"), true );
			Chatanoo.users.on( r.success, function( userId ) {
				this.trigger("change change:unvalidate");
				this.set('_isValid', 0);
			}, this);
		},
		
		deleteUser: function() {
			var r = Chatanoo.users.deleteUser( this.get("id") );
			Chatanoo.users.on( r.success, function( bool ) {
				this.trigger("delete");
			}, this);
		},
		
		editUser: function(options) {
			var user = _.extend(this.toJSON(), options);
			var r = Chatanoo.users.setUser( user );
			Chatanoo.users.on( r.success, function( usertId ) {
				this.set(options);
				this.trigger("edited");
			}, this);
		}
	});
	//_.extend(Comment, Chatanoo.ValueObject.Comment);
	
	return User;
});