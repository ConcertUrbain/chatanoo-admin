define([
  'Backbone',
  'Underscore',
  'jQuery',
  'Chatanoo',
  
  'app/views/abstract_table_view',
  
  'Config',
  
  'app/collections/users',
  'app/views/user_view',
  'app/views/add_user_popin',
  
  'text!app/templates/users.tmpl.html',
  
  'app/views/app_view'
], function(Backbone, _, $, Chatanoo,
  AbstractTableView,
  Config,
  Users, UserView, AddUserPopin,
  template,
  app_view) {
  
  var UsersView = AbstractTableView.extend(
  {
    el: $("#content"),
    
    collection: new Users(),
    voClass: UserView,
    addViewClass: AddUserPopin,
    
    facets: [
      { label: 'id',         value: 'id' }, 
      { label: 'Nom',        value: 'firstName' },
      { label: 'Prénom',      value: 'lastName' },
      { label: 'Pseudo',      value: 'pseudo' },
      { label: 'Email',        value: 'email' },
      { label: 'Rôle',        value: 'role' },
      { label: 'Date d\'ajout',    value: 'addDate' },
      { label: 'Date de modif',   value: 'setDate' }
    ],
    
    initialize: function() {
      //app_view.chatanoo.loadUrl('/queries/20');
      
      AbstractTableView.prototype.initialize.call(this);
      },
  
    events: _.extend( AbstractTableView.prototype.events, {
      
    }),
    
    render: function() {
      this.$el.removeClass().addClass('users');
      
      this.$el.html( _.template( template, { mode: this.mode } ) );
      
      AbstractTableView.prototype.render.call(this);
      return this;
    },
    
    kill: function() {
      this.$el.unbind()
      //this.model.off();
    }
  });
  
  return UsersView;
});