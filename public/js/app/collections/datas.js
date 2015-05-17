define([
  'Underscore',
  'Chatanoo',

  'app/collections/abstract',
  
  'app/models/data_model'
], function( _, Chatanoo,
  AbstractCollection,
  Data ) {
  
  var Datas = AbstractCollection.extend({
    model: Data,
    isValidKey: null,
    
    datasSet: null,
    
    load: function() {
      var mThis = this;
      
      if( !_( this.datasSet ).isUsable() ) {
        this.remove(this.toArray());
        var r = Chatanoo.datas.getDatas( {} );
        Chatanoo.datas.on( r.success, function(datas) {
          _(datas).each( function(type, label) { 
            _(type).each( function(data) { data.type = label; mThis.push(data); } ); 
          }, this );
          mThis.calculate();
          mThis.trigger("load");
        }, this);
        
      } else {
      
        var mThis = this;
        this.datasSet.load( function() {
          mThis.trigger("load");
        });
      
      }
    }
  });
  
  return Datas;
});