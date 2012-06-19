define([], function() {
	return {
		chatanoo: {
			url: 'http://preprod.ws.dring93.org/services',
			//url: 'http://chatanoo-ws.dev/services',
			api_key: 'D93_qJlCaSsBbYBYypwF9TT8KmCOxhuZ',
			anonymous_user: {
				login: "anonymous",
				pass: "anonymous"
			},
			iframe: "http://chatanoo-mobile.dev/index-ios.html"
		},
		notify: {
			url: 'http://notify.dring93.org:3131'
		},
		mediasCenter: {
			url: "http://ms.dring93.org/",
			uploadURL: "http://ms.dring93.org/upload"
		},
		dateFormat: "DD/MM/YYYY"
	}
});