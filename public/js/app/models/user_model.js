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
		
		unvalidateVo: function() {
			var r = Chatanoo.users.banUser( this.get("id"), true );
			Chatanoo.users.on( r.success, function( userId ) {
				this.set('_isBan', 1);
				this.trigger("change change:validate");
			}, this);
		},
		
		validateVo: function() {
			var r = Chatanoo.users.banUser( this.get("id"), false );
			Chatanoo.users.on( r.success, function( userId ) {
				this.set('_isBan', 0);
				this.trigger("change change:unvalidate");
			}, this);
		},
		
		deleteVo: function() {
			var r = Chatanoo.users.deleteUser( this.get("id") );
			Chatanoo.users.on( r.success, function( bool ) {
				this.trigger("delete");
			}, this);
		},
		
		editVo: function(options) {
			var user = _.extend(this.toJSON(), options);
			var r = Chatanoo.users.setUser( user );
			Chatanoo.users.on( r.success, function( usertId ) {
				this.set(options);
				this.trigger("edited");
			}, this);
		},
		
		addVo: function() {
			
		}
	});
	//_.extend(Comment, Chatanoo.ValueObject.Comment);
	
	return User;
});