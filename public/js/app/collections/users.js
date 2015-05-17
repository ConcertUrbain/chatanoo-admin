define([
  'Underscore',
  'Chatanoo',

  'app/collections/abstract',
  
  'app/models/user_model'
], function( _, Chatanoo,
  AbstractCollection,
  User) {
  
  var Users = AbstractCollection.extend({
      model: User,
    isValidKey: "_isBan",
    reverse: true,
    badgeName: "users",

    load: function() {
      this.remove(this.toArray());
      
      var mThis = this;
      var r = Chatanoo.users.getUsers( {} );
      Chatanoo.users.on( r.success, function(users) {
        _(users).each( function (user) { mThis.push( user ); } );
        mThis.calculate();
        mThis.trigger("load");
      }, this);
    }
  });
  
  return Users;  
});