define([
  'Backbone',
  'Underscore',
  'jQuery',
  'Chatanoo',
  
  'app/views/abstract_table_view',
  
  'Config',
  
  'app/collections/datas',
  'app/views/data_view',
  
  'text!app/templates/datas_view.tmpl.html',
  
  'app/views/app_view'
], function(Backbone, _, $, Chatanoo,
  AbstractTableView,
  Config,
  Datas, DataView,
  template,
  app_view) {
  
  var DatasView = AbstractTableView.extend(
  {  
    collection: new Datas(),
    voClass: DataView,
    
    dataType: null,
    
    title: "",
    addLabel: "",
    
    facets: [],
    
    scrollReferer: ".modal-body",
    
    events: _.extend( AbstractTableView.prototype.events, {
      
    }),
    
    initialize: function( options ) {
      this.facets = [];
      this.addOptions = {};
      
      this.addOptions.voId = options.voId;
      this.addOptions.voType = options.voType;
      this.addOptions.__className = "Vo_Data_" + options.dataType;
      
      this.dataType = this.addOptions.type = options.dataType;
      this.title = options.title;
      this.addLabel = options.addLabel;
      
      var mThis = this;
      _( Config.chatanoo.datas[ this.dataType ].structure ).each( function( field ) {
        mThis.facets.push( { label: field.label, value: field.name } );
      })
      
      AbstractTableView.prototype.initialize.call(this);
      },
    
    render: function() {
      this.$el.html( _.template( template, { 
        mode: this.mode, 
        title: this.title,
        add: this.addLabel,
        structure: Config.chatanoo.datas[ this.dataType ].structure
      } ) );
      
      this.delegateEvents();
      
      AbstractTableView.prototype.render.call(this);
      return this;
    },
    
    kill: function() {
      this.$el.unbind()
      this.undelegateEvents();
      //this.model.off();
    }
  });
  
  return DatasView;
});