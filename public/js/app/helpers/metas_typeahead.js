define([
  'Underscore',
  'Chatanoo'
], function(_, Chatanoo) {
    
  var source = {
    name: [],
    content: []
  }
  
  var r = Chatanoo.search.getMetas();
  Chatanoo.search.on( r.success, function(metas) {
    source.name = _.chain( metas ).pluck('name').uniq().compact().value();
    source.content = _.chain( metas ).pluck('content').uniq().compact().value();
  }, this);
  
  return source;
})