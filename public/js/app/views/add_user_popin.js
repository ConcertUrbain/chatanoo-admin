define([
  'Backbone',
  'Underscore',
  'jQuery',
  'Chatanoo',
  
  'Config',
  
  'text!app/templates/add_user_popin.tmpl.html',
], function(Backbone, _, $, Chatanoo,
  Config,
  template) {
  
  var AddUserPopinView = Backbone.View.extend(
  {  
    events: {
      'click .validate': 'processForm',
      'submit #add-user-form': 'processForm'
    },
    
    initialize: function( ) {
      var mThis = this;
      this.$el.addClass("modal hide fade");
      this.$el.on('hidden', function () {
         mThis.kill();
      });
      },
    
    render: function() {
      this.$el.html(_.template( template, { Config: Config } ));
      return this;
    },
    
    processForm: function() {
      var firstName = this.$el.find('input[name=first-name]');
      var lastName = this.$el.find('input[name=last-name]');
      var pseudo = this.$el.find('input[name=pseudo]');
      var password = this.$el.find('input[name=password]');
      var confirm = this.$el.find('input[name=confirm]');
      var email = this.$el.find('input[name=email]');
      var role = this.$el.find('select[name=role]');
      
      var isOnError = false;
      role.parent().parent().removeClass('error');
      pseudo.parent().parent().removeClass('error');
      password.parent().parent().removeClass('error');
      confirm.parent().parent().removeClass('error');
      
      if( role.val() == '' || _.isNull( role.val() ) ) {
        role.parent().parent().addClass('error');
        isOnError = true;
      }
      if( pseudo.val() == '' || _.isNull( pseudo.val() ) ) {
        pseudo.parent().parent().addClass('error');
        isOnError = true;
      }
      if( password.val() == '' || _.isNull( password.val() ) ) {
        password.parent().parent().addClass('error');
        isOnError = true;
      }
      if( password.val() != confirm.val() ) {
        password.parent().parent().addClass('error');
        confirm.parent().parent().addClass('error');
        isOnError = true;
      }
      
      if(isOnError)
        return false;
        
      var user = new Chatanoo.ValueObject.User();
      user.firstName = firstName.val();
      user.lastName = lastName.val();
      user.pseudo = pseudo.val();
      user.password = password.val();
      user.email = email.val();
      user.role = role.val();
      
      var r = Chatanoo.users.addUser( user );
      Chatanoo.users.on( r.success, function( usertId ) {
        this.$el.modal('hide');
      }, this);
      
      return false;
    },
    
    kill: function() {
      this.$el.unbind();
      //this.model.off();
      this.$el.remove();
    }
  });
  
  return AddUserPopinView;
});