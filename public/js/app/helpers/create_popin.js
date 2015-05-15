define(['jQuery'], function($) {
	
	var createPopin = function( Klass, options ) {
		var popin = new Klass( options );
		popin.$el.on('hidden', function () {
			popin.kill();
			popin.remove();
		});
		$('body').append( popin.render().$el );
		popin.$el.modal({ keyboard: false });
		popin.$el.modal('show');
		return popin;
	}
	
	return createPopin;
})