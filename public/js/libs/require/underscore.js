define([
	"order!libs/underscore-1.3.3"
], function() {
	console.log('Underscore loaded');
	
	_.mixin({
		isUsable: function(obj) {
		  	return !_.isNull(obj) && !_.isUndefined(obj) && obj != "";
		},
		getLast: function(str) {
		  	return _( str.split('_') ).last();
		}
	});
	
	return _;
});