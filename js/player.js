class Player extends BaseGameClass {
    constructor() {
        super();

        this._data = {
            id: 0,
            name: false,
            money: 0,
            cards: [],
            landmarksBuilt: 0,
            can: {
                rollTwoDie: false,
                takeAnotherTurn: false,
                rollAgain: false
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

    getMoney() {
        return this.data().money;
    }

    setMoney(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().money = updatedValue;
            return true;
        }
        return false;
    }

    addMoney(amount) {
        if (empty(amount) === false) {
            this.data().money += amount;
            return true;
        }
        return false;
    }

    subtractMoney(amount) {
        if (empty(amount) === false) {
            this.data().money -= amount;
            return true;
        }
        return false;
    }

    getLandmarksBuilt() {
        return this.data().landmarksBuilt;
    }

    setLandmarksBuilt(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().landmarksBuilt = updatedValue;
            return true;
        }
        return false;
    }

    getCanRollTwoDie() {
        return this.data().can.rollTwoDie;
    }

    setCanRollTwoDie(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().can.rollTwoDie = updatedValue;
            return true;
        }
        return false;
    }

    getCanTakeAnotherTurn() {
        return this.data().can.takeAnotherTurn;
    }

    setCanTakeAnotherTurn(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().can.takeAnotherTurn = updatedValue;
            return true;
        }
        return false;
    }

    getCanRollAgain() {
        return this.data().can.rollAgain;
    }

    setCanRollAgain(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().can.rollAgain = updatedValue;
            return true;
        }
        return false;
    }

    addCard(gameCard) {
        if (empty(gameCard) === false) {
            let haveCard = this.getCardById(gameCard.getId());
            if (haveCard) {
                haveCard.increaseHowMany();
            } else {
                let playerCard = new PlayerCard();
                playerCard.setId(gameCard.getId());
                playerCard.setTypeId(gameCard.getTypeId());
                playerCard.setHowMany(1);
                this.data().cards.push(playerCard);
            }
            return true;
        }
        return false;
    }

    removeCard(id) {
        if (empty(id) === false) {
            let playerCard = this.getCardById(id);
            if (playerCard) {
                if (playerCard.getHowMany() === 1) {
                    for (let i = 0; i < this.getTotalCards(); ++i) {
                        if (this.getCards()[i].getId() === id) {
                            this.getCards().splice(i, 1);
                            break;
                        }
                    }
                } else {
                    playerCard.decreaseHowMany();
                }
                return true;
            }
        }
        return false;
    }

    getCardById(id) {
        if (empty(id) === false) {
            for (let i = 0; i < this.getTotalCards(); ++i) {
                if (this.getCards()[i].getId() === id) {
                    return this.getCards()[i];
                }
            }
        }
        return false;
    }

    countCardsByTypeId(typeId) {
        let count = 0;
        for (let i = 0; i < this.getTotalCards(); ++i) {
            if (this.getCards()[i].getTypeId() === typeId) {
                ++count;
            }
        }
        return count;
    }

    getTotalCards() {
        return this.getCards().length;
    }

    getCards() {
        return this.data().cards;
    }

    setCards(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().cards = updatedValue;
            return true;
        }
        return false;
    }

    buildLandmark(id) {
        if (empty(id) === false) {
            let playerCard = this.getCardById(id);
            if (playerCard) {
                playerCard.setIsBuilt(true);
                return true;
            }
        }
        return false;
    }
}