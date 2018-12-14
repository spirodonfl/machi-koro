class API {
	getGame () {
		fetch('/game', {})
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error('failed');
			}).then((data) => {
				console.log(data);
			}).catch((error) => {
				console.error(error);
			});
	}
	getJson (id) {
		fetch('/' + id + '.json', {})
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error('failed');
			}).then((data) => {
				console.log(data);
			}).catch((error) => {
				console.error(error);
			});
	}
}