define([], function() {
	return {
		chatanoo: {
			//url: 'http://touratour.dev/services',
			//url: 'http://preprod.ws.dring93.org/services',
			url: 'http://chatanoo-statging.elasticbeanstalk.com',
			api_key: 'a24j2sW2ueaadyy9462EQF3dc3BUZUje',
			//api_key: 'MJC94_5f86d751cf83daecf09c4493e8',
			anonymous_user: {
				login: "anonymous",
				pass: "anonymous"
			},
			iframe: "http://m.test.chatanoo.org/index-ios.html",
			users: {
				role: {
					admin: 		'Administrateur',
					modo: 		'Modérateur',
					user: 		'Utilisateur',
					anonymous: 	'Anonyme'
				}
			},
			links: {
				Query: {
					parents: ['User'],
					children: ['Meta', 'Data', 'Item', 'Media'],
					canDelete: false
				},
				Item: {
					parents: ['Query', 'User'],
					children: ['Meta', 'Data', 'Comment', 'Media'],
					canDelete: true
				},
				Comment: {
					parents: ['Item', 'User'],
					children: ['Data'],
					canDelete: true
				},
				Media: {
					parents: ['Item', 'User'/*, 'Query'*/],
					children: ['Meta', 'Data'],
					canDelete: true
				},
				Data: {
					parents: ['Item', 'User', 'Query', 'Media', 'Comment'],
					children: [],
					canDelete: true
				},
				Meta: {
					parents: ['Item', 'Query', 'Media'],
					children: [],
					canDelete: false
				},
				User: {
					parents: [],
					children: ['Item', 'Query', 'Media', 'Comment', 'Data', 'Meta'],
					canDelete: false
				}
			},
			datas: {
				Adress: {
					title: "Adresse",
					addLabel: "Ajouter une adresse",
					structure: [
						{ name: "id", 		label: "id", 			type: "static" },
						{ name: "adress", 	label: "Adresse", 		type: "text" },
						{ name: "zipCode", 	label: "Code Postal", 	type: "text" },
						{ name: "city", 	label: "Ville", 		type: "text" },
						{ name: "country", 	label: "Pays", 			type: "text" },
						{ name: "addDate", 	label: "Date d'ajout", 	type: "date" },
						{ name: "setDate", 	label: "Date de modif", type: "date" }
					]
				},
				Carto: {
					title: "Cartographique",
					addLabel: "Ajouter une donnée cartographique",
					structure: [
						{ name: "id", 		label: "id", 			type: "static" },
						{ name: "x", 		label: "x", 			type: "text" },
						{ name: "y", 		label: "y", 			type: "text" },
						{ name: "addDate", 	label: "Date d'ajout", 	type: "date" },
						{ name: "setDate", 	label: "Date de modif", type: "date" }
					]
				},
				Vote: {
					title: "Vote",
					addLabel: "Ajouter un vote",
					structure: [
						{ name: "id", 		label: "id", 			type: "static" },
						{ name: "rate", 	label: "Valeur", 		type: "text" },
						{ name: "user", 	label: "Auteur", 		type: "text" },
						{ name: "addDate", 	label: "Date d'ajout", 	type: "date" },
						{ name: "setDate", 	label: "Date de modif", type: "date" }
					]
				}
			}
		},
		notify: {
			url: 'http://notify.chatanoo.org:3131'
		},
		mediasCenter: {
			url: "http://mc.chatanoo.org/",
			uploadURL: "http://mc.chatanoo.org/upload"
		},
		dateFormat: "DD/MM/YYYY"
	}
});