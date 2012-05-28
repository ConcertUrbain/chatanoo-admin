define([
	'Backbone',
	'Underscore',
	'Chatanoo',
	
	'app/models/user_model'
], function(Backbone, _, Chatanoo,
	User) {
	
	var Users = Backbone.Collection.extend({
    	model: User,

		loadUsers: function() {
			this.remove(this.toArray());
			
			var mThis = this;
			var r = Chatanoo.users.getUsers( {} );
			Chatanoo.users.on( r.success, function(users) {
				_(users).each( function (Users) { mThis.push( Users ); } );
				mThis.trigger("change");
			}, this);
		},
		
		all: function() {
			return this.toArray();
		},
		
		ban: function() {
			return _(this.toArray()).filter( function(Users) {
				return parseInt( Users.get('_isBan') );
			});
		},
		
		unban: function() {
			return _(this.toArray()).filter( function(Users) {
				return !parseInt( Users.get('_isBan') );
			});
		}
	});
	
	return Users;	
});