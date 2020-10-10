class PlayerCard extends BaseGameClass {
    constructor() {
        super();

        this._data = {
            id: 0,
            typeId: 0,
            hasBeen: {
                activatedThisTurn: false
            },
            howMany: 0,
            calculated: {
                purchasePrice: 0,
                incomeAmount: 0
            },
            is: {
                built: 0
            }
        }
    }

    loadData(data) {
        for (let i in data) {
            if (this._data[i] !== undefined) {
                this._data[i] = data[i];
            }
        }
    }

    getId() {
        return this.data().id;
    }

    setId(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().id = updatedValue;
            return true;
        }
        return false;
    }
    
    getTypeId() {
        return this.data().typeId;
    }

    setTypeId(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().typeId = updatedValue;
            return true;
        }
        return false;
    }

    getHasBeenActivatedThisTurn() {
        return this.data().hasBeen.activatedThisTurn;
    }

    setHasBeenActivatedThisTurn(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().hasBeen.activatedThisTurn = updatedValue;
            return true;
        }
        return false;
    }

    getHowMany() {
        return this.data().howMany;
    }

    setHowMany(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().howMany = updatedValue;
            return true;
        }
        return false;
    }
    
    increaseHowMany() {
        ++this.data().howMany;
        return true;
    }

    decreaseHowMany() {
        if (this.data().howMany > 0) {
            --this.data().howMany;
        }
        return true;
    }

    getCalculatedPurchasePrice() {
        return this.data().calculated.purchasePrice;
    }

    setCalculatedPurchasePrice(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().calculated.purchasePrice = updatedValue;
            return true;
        }
        return false;
    }

    getCalculatedIncomeAmount() {
        return this.data().calculated.incomeAmount;
    }

    setCalculatedIncomeAmount(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().calculated.incomeAmount = updatedValue;
            return true;
        }
        return false;
    }

    getIsBuilt() {
        return this.data().is.built;
    }

    setIsBuilt(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().is.built = updatedValue;
            return true;
        }
        return false;
    }
}