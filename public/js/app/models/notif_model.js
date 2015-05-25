define([
  'backbone',
  'underscore',
  'jquery'
], function(Backbone, _, $) {

  var Notif = Backbone.Model.extend(
  {
      defaults: function() {
          return {
        title: "Question",
        description: "La question 1 a été validées",
        type: "info",
        user: "Mathieu Desvé"
      };
      },

      initialize: function() {

      }
  });

  return Notif;
});
