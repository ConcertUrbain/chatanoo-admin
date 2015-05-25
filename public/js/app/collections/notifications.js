define([
  'backbone',
  'underscore',
  'chatanoo',
  'config',

  'app/models/notif_model'
], function( Backbone, _, $,
  Config,
  Notif ) {

  var Notifications = Backbone.Collection.extend({
    model: Notif
  });

  return Notifications;
});
