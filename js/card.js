class Card extends BaseGameClass {
    constructor() {
        super();

        this._data = {
            id: 0,
            name: false,
            description: '',
            maximumAllowedToHave: 0,
            can: {
                othersSee: false,
                beActivatedAnyTurn: false,
                beActivatedThisTurn: false,
                tradeOneCard: false
            },
            typeId: 0,
            purchasePrice: 0,
            incomeAmount: 0,
            is: {
                landmark: false
            },
            activatedBy: {
                diceTotal: [0],
                typeIds: [0]
            },
            takeFrom: {
                playerWhoRolled: false,
                allOtherPlayers: false,
                anyOnePlayer: false,
                bank: false
            },
            allows: {
                rollingTwoDice: false,
                takingAnotherTurnIfDiceMatch: false,
                choosingToRollAgain: false
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

    getPurchasePrice() {
        return this.data().purchasePrice;
    }

    setPurchasePrice(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().purchasePrice = updatedValue;
            return true;
        }
        return false;
    }

    getIncomeAmount() {
        return this.data().incomeAmount;
    }

    setIncomeAmount(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().incomeAmount = updatedValue;
            return true;
        }
        return false;
    }
    
    getName() {
        return this.data().name;
    }

    setName(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().name = updatedValue;
            return true;
        }
        return false;
    }

    getDescription() {
        return this.data().description;
    }

    setDescription(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().description = updatedValue;
            return true;
        }
        return false;
    }

    getMaximumAllowedToHave() {
        return this.data().maximumAllowedToHave;
    }

    setMaximumAllowedToHave(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().maximumAllowedToHave = updatedValue;
            return true;
        }
        return false;
    }

    getCanOthersSee() {
        return this.data().can.othersSee;
    }

    setCanOthersSee(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().can.othersSee = updatedValue;
            return true;
        }
        return false;
    }

    getCanBeActivatedAnyTurn() {
        return this.data().can.beActivatedAnyTurn;
    }

    setCanBeActivatedAnyTurn(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().can.beActivatedAnyTurn = updatedValue;
            return true;
        }
        return false;
    }

    getCanBeActivatedThisTurn() {
        return this.data().can.beActivatedThisTurn;
    }
    
    setCanBeActivatedThisTurn(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().can.beActivatedThisTurn = updatedValue;
            return true;
        }
        return false;
    }
    
    getCanTradeOneCard() {
        return this.data().can.tradeOneCard;
    }
    
    setCanTradeOneCard(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().can.tradeOneCard = updatedValue;
            return true;
        }
        return false;
    }
    
    getIsLandmark() {
        return this.data().is.landmark;
    }
    
    setIsLandmark(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().is.landmark = updatedValue;
            return true;
        }
        return false;
    }

    getActivatedByDiceTotal() {
        return this.data().activatedBy.diceTotal;
    }
    
    setActivatedByDiceTotal(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().activatedBy.diceTotal = updatedValue;
            return true;
        }
        return false;
    }

    getCanBeActivatedByDiceTotal(total) {
        for (let i = 0; i < this.getActivatedByDiceTotal().length; ++i) {
            if (this.getActivatedByDiceTotal()[i] === total) {
                return true;
            }
        }
        return false;
    }
    
    getActivatedByTypeIds() {
        return this.data().activatedBy.typeIds;
    }
    
    setActivatedByTypeIds(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().activatedBy.typeIds = updatedValue;
            return true;
        }
        return false;
    }
    
    getTakeFromPlayerWhoRolled() {
        return this.data().takeFrom.playerWhoRolled;
    }
    
    setTakeFromPlayerWhoRolled(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().takeFrom.playerWhoRolled = updatedValue;
            return true;
        }
        return false;
    }
    
    getTakeFromAllOtherPlayers() {
        return this.data().takeFrom.allOtherPlayers;
    }
    
    setTakeFromAllOtherPlayers(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().takeFrom.allOtherPlayers = updatedValue;
            return true;
        }
        return false;
    }
    
    getTakeFromAnyOnePlayer() {
        return this.data().takeFrom.anyOnePlayer;
    }
    
    setTakeFromAnyOnePlayer(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().takeFrom.anyOnePlayer = updatedValue;
            return true;
        }
        return false;
    }
    
    getTakeFromBank() {
        return this.data().takeFrom.bank;
    }
    
    setTakeFromBank(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().takeFrom.bank = updatedValue;
            return true;
        }
        return false;
    }
    
    getAllowsRollingTwoDice() {
        return this.data().allows.rollingTwoDice;
    }
    
    setAllowsRollingTwoDice(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().allows.rollingTwoDice = updatedValue;
            return true;
        }
        return false;
    }
    
    getAllowsTakingAnotherTurnIfDiceMatch() {
        return this.data().allows.takingAnotherTurnIfDiceMatch;
    }
    
    setAllowsTakingAnotherTurnIfDiceMatch(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().allows.takingAnotherTurnIfDiceMatch = updatedValue;
            return true;
        }
        return false;
    }
    
    getAllowsChoosingToRollAgain() {
        return this.data().allows.choosingToRollAgain;
    }
    
    setAllowsChoosingToRollAgain(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().allows.choosingToRollAgain = updatedValue;
            return true;
        }
        return false;
    }
}