define([
  'backbone',
  'underscore',
  'jquery',
  'chatanoo',
  
  'app/views/abstract_table_view',
  
  'config',
  
  'app/collections/metas',
  'app/views/tag_view',
  
  'text!app/templates/tags.tmpl.html',
  
  'app/views/app_view'
], function(Backbone, _, $, Chatanoo,
  AbstractTableView,
  Config,
  Metas, TagView,
  template,
  app_view) {
  
  var TagsView = AbstractTableView.extend(
  {
    el: $("#content"),
    
    collection: new Metas(),
    voClass: TagView,
    
    facets: [
      { label: 'id',         value: 'id' },
      { label: 'Type',       value: 'name' },
      { label: 'Contenu',     value: 'content' }
    ],
    
    addOption: {
      __className: "Vo_Meta"
    },
    
    initialize: function() {
      // if (app_view.chatanoo)
      //   app_view.chatanoo.loadUrl('/queries/20');
      
      AbstractTableView.prototype.initialize.call(this);
      },
  
    events: _.extend( {
      
    }, AbstractTableView.prototype.events ),
    
    render: function() {
      this.$el.removeClass().addClass('tags');
      
      this.$el.html( _.template( template, { mode: this.mode } ) );
      
      AbstractTableView.prototype.render.call(this);
      return this;
    },
    
    kill: function() {
      this.$el.unbind()
      //this.model.off();
    }
  });
  
  return TagsView;
});