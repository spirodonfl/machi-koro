function empty(e) {
	if (e === "" || e === null || typeof(e) === "undefined") {
		return true;
	}
	return false;

	// We consider 'false' and 0 as legitimate values
}

class BaseGameClass {
	constructor() {
		this._data = false;
	}

	data(data) {
        if (empty(data) === false) {
            this._data = data;
        }
        return this._data;
    }
}