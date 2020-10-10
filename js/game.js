class Game extends BaseGameClass {
    constructor() {
        super();

        this.debug = true;
        this._fsm = new FSM();
        this.last = {
            state: false,
            action: false
        };
        this.messages = {
            error: [],
            data: []
        };
        this.playerIdCounter = 0;
        this._data = {
            types: [ "crop", "animal husbandry", "staple food", "drinks & food", "factory", "natural resources", "major establishment", "market", "landmark" ],
            cards: [],
            players: [],
            defaults: {
                cards: [0, 1, 90, 91, 92, 93],
                money: 3,
                minimum: {
                    cardsInRiver: 6,
                    players: 2
                },
                maximum: {
                    players: 4
                },
                modifiers: {
                    landmarksCostDouble: false
                }
            },
            currentTurn: {
                rollingPlayer: {
                    id: 0,
                    hasRolledTwoDie: false,
                    hasRolledAgain: false,
                    getsAnotherTurn: false,
                    hasTakenAnotherTurn: false
                },
                turnPlayer: {
                    id: 0
                }
            },
            die: [0, 0],
            diceTotal: 0,
            river: [],
            actions: [],
            actionData: [],
            states: {}
        };
        this._data.states[_DATA_STRINGS[31]] = {};
        this._data.states[_DATA_STRINGS[32]] = {};
        this._data.states[_DATA_STRINGS[33]] = {};
        this._data.states[_DATA_STRINGS[34]] = {};
        this._data.states[_DATA_STRINGS[35]] = {};
        this._data.states[_DATA_STRINGS[36]] = {};
        this._data.states[_DATA_STRINGS[37]] = {};
        this._data.states[_DATA_STRINGS[38]] = {};
    }

    error(message, data) {
        this.messages.error.push(message);
        if (empty(data) === false) {
            this.messages.data.push(data);
        }
        if (this.debug) { console.error(message, data); }
        this.last.state = this.fsm().state;
        this.last.action = this.fsm().action;
        // this.fsm().transition('error');
    }

    save() {}

    loadGame(data) {
        this.setFSMStates();
        for (let i = 0; i < data.cards.length; ++i) {
            let dataCard = data.cards[i]._data;
            let newCard = new Card();
            newCard.loadData(dataCard);
            data.cards[i] = newCard;
        }
        for (let i = 0; i < data.players.length; ++i) {
            let playerData = data.players[i]._data;
            let player = new Player();
            player.loadData(playerData);
            for (let c = 0; c < player.getCards().length; ++c) {
                let cardData = player.getCards()[c]._data;
                let card = new PlayerCard();
                card.loadData(cardData);
                player.getCards()[c] = card;
            }
            data.players[i] = player;
        }
        this.data(data);
    }

    newGame() {
        this.setFSMStates();
    }

    getFSMStates() {
        return Object.assign({}, this.data().states);
    }

    fsm() {
        return this._fsm;
    }

    setFSMStates() {
        this.fsm().states = this.getFSMStates();

        // error state
        this.fsm().states[_DATA_STRINGS[69]] = {};

        // default actions for states (enter / exit)
        for (var s in this.fsm().states) {
            this.fsm().states[s][_DATA_STRINGS[66]] = () => {}
            this.fsm().states[s][_DATA_STRINGS[67]] = () => {}
        }

        // inactive
        this.fsm().transition(_DATA_STRINGS[31]);

        this.fsm().states[_DATA_STRINGS[69]][_DATA_STRINGS[66]] = () => {
            this.addAction(_DATA_STRINGS[69]);
        }

        // modifier stuff
        this.fsm().states[_DATA_STRINGS[32]][_DATA_STRINGS[60]] = (modifiers) => {
            if (empty(modifiers) === false) {
                // TODO: This
                this.fsm().transition(_DATA_STRINGS[33]);
            } else {
                this.error(_DATA_STRINGS[61], {modifiers});
                // TODO: Where do we go back to?
            }
        }

        // player setup
        this.fsm().states[_DATA_STRINGS[33]][_DATA_STRINGS[62]] = (name) => {
            if (empty(name) === false) {
                this.addPlayer(name);
                if (this.getTotalPlayers() === this.getMaximumPlayers()) {
                    this.fsm().transition(_DATA_STRINGS[34]);
                    this.fsm().handle(_DATA_STRINGS[68]);
                }
            } else {
                this.error(_DATA_STRINGS[63], {name});
                // TODO: Where do we go back to?
            }
        }
        // start game manually in the case of enough players
        this.fsm().states[_DATA_STRINGS[33]][_DATA_STRINGS[64]] = () => {
            if (this.getTotalPlayers() >= this.getMinimumPlayers()) {
                this.addAction(_DATA_STRINGS[9]);
                this.fsm().transition(_DATA_STRINGS[34]);
                this.fsm().handle(_DATA_STRINGS[68]);
            } else {
                this.error(_DATA_STRINGS[65]);
                // TODO: Where do we go back to?
            }
        }

        // setup the "board", so to speak
        // create all the cards first
        this.fsm().states[_DATA_STRINGS[34]][_DATA_STRINGS[68]] = () => {
            for (var i = 0; i < _DATA_CARDS.length; ++i) {
                let dataCard = _DATA_CARDS[i];
                let newCard = new Card();
                newCard.setId(dataCard.id);
                newCard.setTypeId(dataCard.typeId);
                newCard.setName(dataCard.name);
                newCard.setDescription(dataCard.description);
                newCard.setPurchasePrice(dataCard.purchasePrice);
                newCard.setIncomeAmount(dataCard.incomeAmount);
                newCard.setMaximumAllowedToHave(dataCard.maximumAllowedToHave);
                newCard.setCanOthersSee(dataCard.can.othersSee);
                newCard.setCanBeActivatedAnyTurn(dataCard.can.beActivatedAnyTurn);
                newCard.setCanBeActivatedThisTurn(dataCard.can.beActivatedThisTurn);
                newCard.setCanTradeOneCard(dataCard.can.tradeOneCard);
                newCard.setIsLandmark(dataCard.is.landmark);
                newCard.setActivatedByDiceTotal(dataCard.activatedBy.diceTotal);
                newCard.setActivatedByTypeIds(dataCard.activatedBy.typeIds);
                newCard.setTakeFromPlayerWhoRolled(dataCard.takeFrom.playerWhoRolled);
                newCard.setTakeFromAllOtherPlayers(dataCard.takeFrom.allOtherPlayers);
                newCard.setTakeFromAnyOnePlayer(dataCard.takeFrom.anyOnePlayer);
                newCard.setTakeFromBank(dataCard.takeFrom.bank);
                newCard.setAllowsRollingTwoDice(dataCard.allows.rollingTwoDice);
                newCard.setAllowsTakingAnotherTurnIfDiceMatch(dataCard.allows.takingAnotherTurnIfDiceMatch);
                newCard.setAllowsChoosingToRollAgain(dataCard.allows.choosingToRollAgain);
                this.data().cards.push(newCard);
            }
            this.fsm().handle(_DATA_STRINGS[70]);
        }
        // setup river
        this.fsm().states[_DATA_STRINGS[34]][_DATA_STRINGS[70]] = () => {
            while (this.getTotalCardsInRiver() < this.getMinimumCardsInRiver()) {
                let card = this.randomCard();
                this.addCardToRiver(card.getId());
            }
            this.addAction(_DATA_STRINGS[74]);
            this.fsm().handle(_DATA_STRINGS[71]);
        }
        // give players default cards
        this.fsm().states[_DATA_STRINGS[34]][_DATA_STRINGS[71]] = () => {
            for (let i = 0; i < this.getTotalPlayers(); ++i) {
                let player = this.getPlayerByIndex(i);
                let defaultCards = this.getDefaultCards();
                for (var j = 0; j < defaultCards.length; ++j) {
                    this.giveCardToPlayer(defaultCards[j], player.getId());
                }
            }
            this.addAction(_DATA_STRINGS[73]);
            this.fsm().handle(_DATA_STRINGS[72]);
        }
        // give players default money
        this.fsm().states[_DATA_STRINGS[34]][_DATA_STRINGS[72]] = () => {
            for (var i = 0; i < this.getTotalPlayers(); ++i) {
                let player = this.getPlayerByIndex(i);
                this.giveMoneyToPlayer(this.getDefaultMoney(), player);
            }
            this.addAction(_DATA_STRINGS[30]);
            this.fsm().handle(_DATA_STRINGS[75]);
        }
        // choose starting player
        this.fsm().states[_DATA_STRINGS[34]][_DATA_STRINGS[75]] = () => {
            this.setRollingPlayerId(this.randomPlayer().getId());
            this.addAction(_DATA_STRINGS[29], {id: this.getRollingPlayerId()});
            this.setTurnPlayerId(this.getRollingPlayerId());
            this.fsm().transition(_DATA_STRINGS[35]);
            this.fsm().handle(_DATA_STRINGS[76]);
        }

        // rolling dice
        // wait for player to roll
        this.fsm().states[_DATA_STRINGS[35]][_DATA_STRINGS[76]] = () => {
            this.addAction(_DATA_STRINGS[0], {id: this.getRollingPlayerId()});
        }
        // roll
        this.fsm().states[_DATA_STRINGS[35]][_DATA_STRINGS[77]] = (howMany) => {
            this.setDie(0, this.roll());
            if (this.getRollingPlayer().getCanRollTwoDie() && howMany === 2) {
                this.setRollingPlayerHasRolledTwoDie(true);
                this.setDie(1, this.roll());
            } else {
                this.setDie(1, 0);
            }
            this.setDiceTotal(this.getDie(0) + this.getDie(1));
            if (this.getRollingPlayer().getCanRollAgain() && this.getRollingPlayerHasRolledAgain() === false) {
                this.fsm().handle(_DATA_STRINGS[78]);
            } else {
                this.fsm().handle(_DATA_STRINGS[79]);
            }
        }
        // wait for player to choose to roll again
        this.fsm().states[_DATA_STRINGS[35]][_DATA_STRINGS[78]] = () => {
            this.addAction(_DATA_STRINGS[1]);
        }
        // process roll again choice
        this.fsm().states[_DATA_STRINGS[35]][_DATA_STRINGS[80]] = (yesOrNo) => {
            if (empty(yesOrNo) === false && yesOrNo === true) {
                this.addAction(_DATA_STRINGS[28]);
                this.setRollingPlayerHasRolledAgain(true);
                this.setRollingPlayerHasRolledTwoDie(false);
                this.fsm().transition(_DATA_STRINGS[35]);
                this.fsm().handle(_DATA_STRINGS[76]);
            } else {
                this.fsm().handle(_DATA_STRINGS[79]);
            }
        }
        // process roll
        this.fsm().states[_DATA_STRINGS[35]][_DATA_STRINGS[79]] = () => {
            if (this.getRollingPlayer().getCanTakeAnotherTurn() === true && this.getRollingPlayerHasTakenAnotherTurn() === false && this.getDie(0) === this.getDie(1)) {
                this.setRollingPlayerGetsAnotherTurn(true);
            }
            this.fsm().transition(_DATA_STRINGS[36]);
            this.fsm().handle(_DATA_STRINGS[81], true);
        }

        // player turn
        // wait for player to do something
        this.fsm().states[_DATA_STRINGS[36]][_DATA_STRINGS[81]] = (selectPreviousPlayer) => {
            if (empty(selectPreviousPlayer) === false && selectPreviousPlayer === true) {
                this.selectPreviousPlayer();
            }
            this.addAction(_DATA_STRINGS[2], {id: this.getTurnPlayerId()});
        }
        // activate card
        this.fsm().states[_DATA_STRINGS[36]][_DATA_STRINGS[6]] = (cardId) => {
            if (empty(cardId) === false) {
                let player = this.getTurnPlayer();
                let card = this.getCardById(cardId);
                let playerCard = player.getCardById(cardId);
                if (empty(card) === false && empty(playerCard) === false) {
                    if (
                        card.getCanBeActivatedByDiceTotal(this.getDiceTotal()) === true
                        && (
                            card.getCanBeActivatedAnyTurn() === true 
                            || (this.getTurnPlayerId() === this.getRollingPlayerId())
                        ) 
                        && playerCard.getHasBeenActivatedThisTurn() === false
                    ) {
                        this.fsm().handle(_DATA_STRINGS[85], cardId);
                    } else if (card.getCanBeActivatedByDiceTotal(this.getDiceTotal()) === false) {
                        this.error(_DATA_STRINGS[86], {cardId, activatedBy: card.getActivatedByDiceTotal(), rolledTotal: this.getDiceTotal()});
                        this.fsm().handle(_DATA_STRINGS[81]);
                    } else if (card.getCanBeActivatedAnyTurn() === false) {
                        this.error(_DATA_STRINGS[87], {cardId});
                        this.fsm().handle(_DATA_STRINGS[81]);
                    } else if (playerCard.getHasBeenActivatedThisTurn() === true) {
                        this.error(_DATA_STRINGS[88], {cardId});
                        this.fsm().handle(_DATA_STRINGS[81]);
                    }
                } else if (empty(playerCard) === true) {
                    this.error(_DATA_STRINGS[83], {cardId, playerId: this.getTurnPlayerId()});
                    this.fsm().handle(_DATA_STRINGS[81]);
                } else if (empty(card) === true) {
                    this.error(_DATA_STRINGS[84], {cardId, playerId: this.getTurnPlayerId()});
                    this.fsm().handle(_DATA_STRINGS[81]);
                }
            } else {
                this.error(_DATA_STRINGS[82], {cardId});
                this.fsm().handle(_DATA_STRINGS[81]);
            }
        }
        // process activated card
        this.fsm().states[_DATA_STRINGS[36]][_DATA_STRINGS[85]] = (cardId) => {
            if (empty(cardId) === false) {
                let card = this.getCardById(cardId);
                if (empty(card) === false) {
                    if (card.getCanTradeOneCard()) {
                        this.fsm().handle(_DATA_STRINGS[91], cardId);
                    } else if (card.getTakeFromAnyOnePlayer()) {
                        this.fsm().handle(_DATA_STRINGS[90], cardId);
                    } else {
                        this.fsm().handle(_DATA_STRINGS[92], cardId);
                    }
                } else {
                    this.error(_DATA_STRINGS[84], {cardId});
                    this.fsm().handle(_DATA_STRINGS[81]);
                }
            } else {
                this.error(_DATA_STRINGS[89], {cardId});
                this.fsm().handle(_DATA_STRINGS[81]);
            }
        }
        // wait for player to choose player to take money from
        this.fsm().states[_DATA_STRINGS[36]][_DATA_STRINGS[90]] = (cardId) => {
            this.addAction(_DATA_STRINGS[8], {playerId: this.getTurnPlayerId(), cardId});
        }
        // wait for player to choose player and card to trade
        this.fsm().states[_DATA_STRINGS[36]][_DATA_STRINGS[91]] = (cardId) => {
            this.addAction(_DATA_STRINGS[7], {playerId: this.getTurnPlayerId(), cardId});
        }
        // process trade card
        this.fsm().states[_DATA_STRINGS[36]][_DATA_STRINGS[93]] = (targetPlayerId, targetCardId) => {
            if (empty(targetPlayerId) === false && empty(targetCardId) === false) {
                let playerA = this.getTurnPlayer();
                let playerB = this.getPlayerById(targetPlayerId);
                if (playerA.getId() !== playerB.getId()) {
                    let playerCard = playerA.getCardById(6);
                    let targetGameCard = this.getCardById(targetCardId);
                    if (empty(playerCard) === false && empty(targetGameCard) === false) {
                        this.addAction(_DATA_STRINGS[4], {cardId: 6, player: playerA});
                        this.removeCardFromPlayer(6, playerA.getId());
                        this.giveCardToPlayer(6, playerB.getId());
                        this.removeCardFromPlayer(targetCardId, playerB.getId());
                        this.giveCardToPlayer(targetCardId, playerA.getId());
                        this.addAction(_DATA_STRINGS[27], {playerId: playerA.getId(), targetPlayerId, targetCardId});
                        this.fsm().handle(_DATA_STRINGS[81]);
                    } else if (empty(playerCard) === true) {
                        this.error(_DATA_STRINGS[94], {cardId: 6, playerId: playerA.getId()});
                        this.fsm().handle(_DATA_STRINGS[81]);
                    } else if (empty(targetGameCard) === true) {
                        this.error(_DATA_STRINGS[94], {cardId: targetCardId, playerId: playerB.getId()});
                        this.fsm().handle(_DATA_STRINGS[81]);
                    }
                } else if (playerA.getId() === playerB.getId()) {
                    this.error(_DATA_STRINGS[107], {targetPlayerId});
                    this.fsm().handle(_DATA_STRINGS[81]);
                }
            } else if (empty(targetPlayerId) === false) {
                this.error(_DATA_STRINGS[95], {targetPlayerId});
                this.fsm().handle(_DATA_STRINGS[81]);
            } else if (empty(targetCardId) === false) {
                this.error(_DATA_STRINGS[96], {targetCardId});
                this.fsm().handle(_DATA_STRINGS[81]);
            }
        }
        // process take money
        this.fsm().states[_DATA_STRINGS[36]][_DATA_STRINGS[92]] = (cardId, targetPlayerId) => {
            if (empty(cardId) === false) {
                let player = this.getTurnPlayer();
                let card = this.getCardById(cardId);
                let playerCard = player.getCardById(cardId);
                if (empty(card) === false && empty(playerCard) === false) {
                    this.addAction(_DATA_STRINGS[4], {cardId, player});
                    this.calculateIncomeAmount(player.getId(), cardId);
                    if (card.getTakeFromBank()) {
                        this.giveMoneyToPlayerFromBank(playerCard.getCalculatedIncomeAmount(), player.getId());
                        playerCard.setHasBeenActivatedThisTurn(true);
                    } else if (card.getTakeFromPlayerWhoRolled()) {
                        this.giveMoneyFromPlayerToAnother(playerCard.getCalculatedIncomeAmount(), this.getRollingPlayer().getId(), player.getId());
                        playerCard.setHasBeenActivatedThisTurn(true);
                    } else if (card.getTakeFromAllOtherPlayers()) {
                        this.giveMoneyToPlayerFromAllOtherPlayers(playerCard.getCalculatedIncomeAmount(), player.getId());
                        playerCard.setHasBeenActivatedThisTurn(true);
                    } else if (card.getTakeFromAnyOnePlayer()) {
                        if (empty(targetPlayerId) === false) {
                            if (player.getId() !== targetPlayerId) {
                                this.giveMoneyFromPlayerToAnother(playerCard.getCalculatedIncomeAmount(), targetPlayerId, player.getId());
                                playerCard.setHasBeenActivatedThisTurn(true);
                            } else if (player.getId() === targetPlayerId) {
                                this.error(_DATA_STRINGS[107], {targetPlayerId});
                                this.fsm().handle(_DATA_STRINGS[81]);
                            }
                        } else if (empty(targetPlayerId) === true) {
                            this.error(_DATA_STRINGS[97], {targetPlayerId});
                            this.fsm().handle(_DATA_STRINGS[81]);
                        }
                    }
                    this.fsm().handle(_DATA_STRINGS[81]);
                } else if (empty(card) === true) {
                    this.error(_DATA_STRINGS[84], {cardId});
                    this.fsm().handle(_DATA_STRINGS[81]);
                } else if (empty(playerCard) === true) {
                    this.error(_DATA_STRINGS[94], {cardId, playerId: targetPlayerId});
                    this.fsm().handle(_DATA_STRINGS[81]);
                }
            } else {
                this.error(_DATA_STRINGS[82], {cardId});
                this.fsm().handle(_DATA_STRINGS[81]);
            }
        }
        // end turn
        this.fsm().states[_DATA_STRINGS[36]][_DATA_STRINGS[98]] = () => {
            this.addAction(_DATA_STRINGS[99], {id: this.getTurnPlayerId()});
            if (this.getTurnPlayerId() === this.getRollingPlayerId()) {
                this.fsm().transition(_DATA_STRINGS[37]);
                this.fsm().handle(_DATA_STRINGS[100]);
            } else {
                this.fsm().handle(_DATA_STRINGS[81], true);
            }
        }

        // rolling player end phase
        // wait for player to decide what to do
        this.fsm().states[_DATA_STRINGS[37]][_DATA_STRINGS[100]] = () => {
            this.addAction(_DATA_STRINGS[3], {id: this.getRollingPlayerId()});
        }
        // purchase card
        this.fsm().states[_DATA_STRINGS[37]][_DATA_STRINGS[103]] = (cardId) => {
            if (empty(cardId) === false) {
                let card = this.getCardById(cardId);
                if (empty(card) === false) {
                    let rollingPlayer = this.getRollingPlayer();
                    if (this.playerCanPurchaseCard(cardId, rollingPlayer.getId())) {
                        this.addAction(_DATA_STRINGS[54], {cardId, playerID: rollingPlayer.getId()});
                        this.playerPurchasesCardFromRiver(cardId, rollingPlayer.getId());
                        this.removeCardFromRiver(cardId);
                        this.fsm().handle(_DATA_STRINGS[98]);
                    } else {
                        this.error(_DATA_STRINGS[101], {cardId, playerId: this.getRollingPlayerId()});
                        this.fsm().handle(_DATA_STRINGS[100]);
                    }
                } else if (empty(card) === true) {
                    this.error(_DATA_STRINGS[84], {cardId});
                    this.fsm().handle(_DATA_STRINGS[100]);
                }
            } else {
                this.error(_DATA_STRINGS[102], {cardId});
                this.fsm().handle(_DATA_STRINGS[100]);
            }
        }
        // build landmark
        this.fsm().states[_DATA_STRINGS[37]][_DATA_STRINGS[104]] = (cardId) => {
            if (empty(cardId) === false) {
                let card = this.getCardById(cardId);
                let playerCard = this.getRollingPlayer().getCardById(cardId);
                if (empty(card) === false && empty(playerCard) === false && card.getIsLandmark() === true) {
                    playerCard.setIsBuilt(true);
                    // TODO: this.playerBuildsLandmark()
                    this.giveMoneyToBankFromPlayer(this.calculatePurchasePrice(cardId), this.getRollingPlayerId());
                    this.addAction(_DATA_STRINGS[26], {cardId, playerId: this.getRollingPlayerId()});
                    this.getRollingPlayer().data().landmarksBuilt += 1;
                    if (this.getRollingPlayer().getLandmarksBuilt() === 4) {
                        this.fsm().transition(_DATA_STRINGS[38]);
                        this.fsm().handle(_DATA_STRINGS[39]);
                    }

                    if (card.getAllowsRollingTwoDice() === true) {
                         this.getRollingPlayer().setCanRollTwoDie(true);
                    } else if (card.getAllowsTakingAnotherTurnIfDiceMatch() === true) {
                        this.getRollingPlayer().setCanTakeAnotherTurn(true);
                    } else if (card.getAllowsChoosingToRollAgain() === true) {
                        this.getRollingPlayer().setCanRollAgain(true);
                    }

                    this.fsm().handle(_DATA_STRINGS[98]);
                } else if (empty(card) === true) {
                    this.error(_DATA_STRINGS[84], {cardId});
                    this.fsm().handle(_DATA_STRINGS[100]);
                } else if (empty(playerCard) === true) {
                    this.error(_DATA_STRINGS[94], {cardId, playerId: this.getRollingPlayerId()});
                    this.fsm().handle(_DATA_STRINGS[100]);
                } else if (card.getIsLandmark() === false) {
                    this.error(_DATA_STRINGS[106], {cardId});
                    this.fsm().handle(_DATA_STRINGS[100]);
                }
            } else {
                this.error(_DATA_STRINGS[105], {cardId});
                this.fsm().handle(_DATA_STRINGS[100]);
            }
        }
        // end turn
        this.fsm().states[_DATA_STRINGS[37]][_DATA_STRINGS[98]] = () => {
            this.setRollingPlayerHasRolledTwoDie(false);
            this.setRollingPlayerHasRolledAgain(false);
            for (var p = 0; p < this.getTotalPlayers(); ++p) {
                let player = this.getPlayers()[p];
                let playerCards = player.getCards();
                for (var c = 0; c < playerCards.length; ++c) {
                    let card = playerCards[c];
                    card.setHasBeenActivatedThisTurn(false);
                }
            }
            this.addAction(_DATA_STRINGS[25], {id: this.getRollingPlayerId()});
            // If the rolling player has the landmark built to take another turn AND they rolled doubles
            if (this.getRollingPlayer().getCanTakeAnotherTurn() && this.getRollingPlayerGetsAnotherTurn()) {
                this.setRollingPlayerGetsAnotherTurn(false);
                this.setRollingPlayerHasTakenAnotherTurn(true);
            } else {
                this.setRollingPlayerHasTakenAnotherTurn(false);
                this.selectNextPlayer();
                this.setRollingPlayerId(this.getTurnPlayerId());
            }
            this.fsm().transition(_DATA_STRINGS[35]);
            this.fsm().handle(_DATA_STRINGS[76]);
        }

        // finished
        // notify everyone
        this.fsm().states[_DATA_STRINGS[38]][_DATA_STRINGS[39]] = () => {
            this.addAction(_DATA_STRINGS[24], {id: this.getRollingPlayerId()});
        }
    }

    selectPreviousPlayer() {
        let index = this.getPlayerIndexById(this.getTurnPlayerId());
        if (index === 0) {
            index = (this.getTotalPlayers() - 1);
        } else {
            --index;
        }
        this.setTurnPlayerId(this.getPlayerByIndex(index).getId());
    }

    selectNextPlayer() {
        let index = this.getPlayerIndexById(this.getTurnPlayerId());
        if (index === (this.getTotalPlayers() - 1)) {
            index = 0;
        } else {
            ++index;
        }
        this.setTurnPlayerId(this.getPlayerByIndex(index).getId());
    }

    getPlayerIndexById(id) {
        for (var i = 0; i < this.getTotalPlayers(); ++i) {
            if (this.getPlayers()[i].getId() === id) {
                return i;
            }
        }
        return false;
    }

    randomPlayer() {
        return this.data().players[Math.floor(Math.random() * this.getTotalPlayers())];
    }

    giveMoneyToPlayer(amount, player) {
        if (empty(amount) === false && empty(player) === false) {
            player.addMoney(amount);
            this.addAction(_DATA_STRINGS[23], {amount, player});
            return true;
        }
        return false;
    }

    removeCardFromPlayer(cardId, playerId) {
        if (empty(cardId) === false && empty(playerId) === false) {
            let player = this.getPlayerById(playerId);
            let gameCard = this.getCardById(cardId);
            if (player.removeCard(cardId)) {
                if (gameCard.getIsLandmark() === true) {
                    this.addAction(_DATA_STRINGS[58], {cardId, cardName: gameCard.getName(), player});
                } else {
                    this.addAction(_DATA_STRINGS[57], {cardId, cardName: gameCard.getName(), player});
                }
                return true;
            }
        }
        return false;
    }

    giveCardToPlayer(cardId, playerId) {
        if (empty(cardId) === false && empty(playerId) === false) {
            let player = this.getPlayerById(playerId);
            let gameCard = this.getCardById(cardId);
            let playerCard = player.getCardById(cardId);
            if ((empty(playerCard) === false && playerCard && playerCard.getHowMany() < gameCard.getMaximumAllowedToHave()) || empty(playerCard) === true || playerCard === false) {
                if (player.addCard(gameCard)) {
                    if (gameCard.getIsLandmark() === true) {
                        this.addAction(_DATA_STRINGS[40], {cardId, cardName: gameCard.getName(), player});
                    } else {
                        this.addAction(_DATA_STRINGS[22], {cardId, cardName: gameCard.getName(), player});
                    }
                    return true;
                }
            } else if (empty(playerCard) === false && playerCard && playerCard.getHowMany() === gameCard.getMaximumAllowedToHave()) {
                // Simply don't increment the card count
                if (gameCard.getIsLandmark() === true) {
                    this.addAction(_DATA_STRINGS[40], {cardId, cardName: gameCard.getName(), player});
                } else {
                    this.addAction(_DATA_STRINGS[22], {cardId, cardName: gameCard.getName(), player});
                }
                return true;
            }
        }
        return false;
    }

    playerCanPurchaseCard(cardId, playerId) {
        let card = this.getCardById(cardId);
        let player = this.getPlayerById(playerId);
        if (player.getMoney() >= this.calculatePurchasePrice(cardId)) {
            return true;
        }
        return false;
    }

    playerPurchasesCardFromRiver(cardId, playerId) {
        this.giveMoneyToBankFromPlayer(this.calculatePurchasePrice(cardId), playerId);
        this.giveCardToPlayer(cardId, playerId);
        return true;
    }

    randomCard() {
        let card = this.data().cards[Math.floor(Math.random() * this.getTotalCards())];
        while (card.getIsLandmark()) {
            card = this.data().cards[Math.floor(Math.random() * this.getTotalCards())];
        }
        return card;
    }

    getPlayerByIndex(index) {
        if (empty(index) === false) {
            return this.data().players[index];
        }
        return false;
    }

    getMaximumPlayers() {
        return this.data().defaults.maximum.players;
    }

    setMaximumPlayers(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().defaults.maximum.players = updatedValue;
            return true;
        }
        return false;
    }

    getMinimumPlayers() {
        return this.data().defaults.minimum.players;
    }

    setMinimumPlayers(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().defaults.minimum.players = updatedValue;
            return true;
        }
        return false;
    }

    setDefaultCards(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().defaults.cards = updatedValue;
            return true;
        }
        return false;
    }

    getDefaultCards() {
        return this.data().defaults.cards;
    }

    getMinimumCardsInRiver() {
        return this.data().defaults.minimum.cardsInRiver;
    }

    setMinimumCardsInRiver(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().defaults.minimum.cardsInRiver = updatedValue;
            return true;
        }
        return false;
    }

    getTotalCardsInRiver() {
        return this.getRiver().length;
    }

    getModifierLandmarksCostDouble() {
        // TODO: This
    }
    setModifierLandmarksCostDouble() {
        // TODO: This
    }
    
    setRollingPlayerId(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().currentTurn.rollingPlayer.id = updatedValue;
            return true;
        }
        return false;
    }

    getRollingPlayerId() {
        return this.data().currentTurn.rollingPlayer.id;
    }

    getRollingPlayer() {
        return this.getPlayerById(this.getRollingPlayerId());
    }

    
    getRollingPlayerHasRolledTwoDie() {
        return this.data().currentTurn.rollingPlayer.hasRolledTwoDie;
    }

    setRollingPlayerHasRolledTwoDie(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().currentTurn.rollingPlayer.hasRolledTwoDie = updatedValue;
            this.addAction(_DATA_STRINGS[21], {updatedValue});
            return true;
        }
        return false;
    }
    
    getRollingPlayerHasRolledAgain() {
        return this.data().currentTurn.rollingPlayer.hasRolledAgain;
    }

    setRollingPlayerHasRolledAgain(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().currentTurn.rollingPlayer.hasRolledAgain = updatedValue;
            this.addAction(_DATA_STRINGS[20], {updatedValue});
            return true;
        }
        return false;
    }
    
    getRollingPlayerGetsAnotherTurn() {
        return this.data().currentTurn.rollingPlayer.getsAnotherTurn;
    }

    setRollingPlayerGetsAnotherTurn(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().currentTurn.rollingPlayer.getsAnotherTurn = updatedValue;
            this.addAction(_DATA_STRINGS[19], {updatedValue, playerId: this.getRollingPlayerId()});
            return true;
        }
        return false;
    }

    getRollingPlayerHasTakenAnotherTurn() {
        return this.data().currentTurn.rollingPlayer.hasTakenAnotherTurn;
    }

    setRollingPlayerHasTakenAnotherTurn(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().currentTurn.rollingPlayer.hasTakenAnotherTurn = updatedValue;
            this.addAction(_DATA_STRINGS[18], {updatedValue});
            return true;
        }
        return false;
    }

    getRollingPlayerHasActivatedCards() {
        // TODO: This
    }
    setRollingPlayerHasActivatedCards() {
        // TODO: This
    }

    getTurnPlayerId() {
        return this.data().currentTurn.turnPlayer.id;
    }

    setTurnPlayerId(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().currentTurn.turnPlayer.id = updatedValue;
            this.addAction(_DATA_STRINGS[17], {updatedValue});
            return true;
        }
        return false;
    }

    getTurnPlayer() {
        return this.getPlayerById(this.getTurnPlayerId());
    }

    onBeforeActionAdded() {
        // console.log('onBeforeActionAdded');
    }
    onActionAdded() {
        // console.log('onActionAdded');
    }
    onAfterActionAdded() {
        // console.log('onAfterActionAdded');
    }

    addAction(message, data) {
        if (empty(message) === false) {
            this.onBeforeActionAdded();
            this.data().actions.push(message);
            // if (message === _DATA_STRINGS[4]) {
            //     console.trace('here');
            // }
            if (empty(data) === false) {
                this.data().actionData.push(JSON.stringify(data));
            } else {
                this.data().actionData.push(JSON.stringify([]));
            }
            this.onActionAdded();
            this.onAfterActionAdded();
            return true;
        }
        return false;
    }

    getActions() {
        return this.data().actions;
    }

    getTotalActions() {
        return this.data().actions.length;
    }

    getLastAction() {
        if (this.getTotalActions() > 0) {
            return this.getActions()[(this.getTotalActions() - 1)];
        }
    }

    setActions(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().actions = updatedValue;
            return true;
        }
        return false;
    }

    getActionData() {
        return this.data().actionData;
    }

    getTotalActionData() {
        return this.data().actionData.length;
    }

    getLastActionData() {
        if (this.getTotalActionData() > 0) {
            return this.getActionData()[(this.getTotalActionData() - 1)];
        }
    }

    setActionData(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().actionData = updatedValue;
            return true;
        }
        return false;
    }
    
    getDie(which) {
        return this.data().die[which];
    }

    setDie(which, updatedValue) {
        if (empty(which) === false && empty(updatedValue) === false) {
            this.data().die[which] = updatedValue;
            this.addAction(_DATA_STRINGS[16], {which, updatedValue});
            return true;
        }
        return false;
    }
    
    getDiceTotal() {
        return this.data().diceTotal;
    }

    setDiceTotal(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().diceTotal = updatedValue;
            return true;
        }
        return false;
    }
    
    roll(max) {
        if (max === undefined) {
            max = 6;
        }
        return Math.floor(Math.random() * max) + 1;
    }

    getPlayerById(id) {
        if (empty(id) === false) {
            for (let i = 0; i < this.getTotalPlayers(); ++i) {
                let player = this.getPlayers()[i];
                if (player.getId() === id) {
                    return player;
                }
            }
        }
        return false;
    }

    loadPlayer(data) {
        let player = new Player();
        for (let i = 0; i < data.cards.length; ++i) {
            let newCard = new PlayerCard();
            newCard.loadData(data.cards[i]);
            data.cards[i] = newCard;
        }
        player.loadData(data);
        return player;
    }

    getTotalCards() {
        return this.getCards().length;
    }
    
    getCardById(id) {
        if (empty(id) === false) {
            for (let i = 0; i < this.getTotalCards(); ++i) {
                let card = this.getCards()[i];
                if (card.getId() === id) {
                    return card;
                }
            }
        }
        return false;
    }

    getCards() {
        return this.data().cards;
    }
    
    getPlayers() {
        return this.data().players;
    }

    setRiver(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().river = updatedValue;
            return true;
        }
        return false;
    }
    
    getRiver() {
        return this.data().river;
    }

    removeCardFromRiver(cardId) {
        if (this.cardIsInRiver(cardId)) {
            let index = false;
            let river = this.getRiver();
            for (var i = 0; i < river.length; ++i) {
                if (river[i] === cardId) {
                    index = i;
                    break;
                }
            }
            if (index !== false) {
                river.splice(index, 1);
                this.addAction(_DATA_STRINGS[14], {cardId});
                let newCard = this.randomCard();
                while (this.cardIsInRiver(newCard.getId())) {
                    newCard = this.randomCard();
                }
                this.addCardToRiver(newCard.getId());
            }
        }
    }

    addCardToRiver(cardId) {
        if (!this.cardIsInRiver(cardId)) {
            this.data().river.push(cardId);
            this.addAction(_DATA_STRINGS[15], {cardId});
            return true;
        }
        return false;
    }

    cardIsInRiver(cardId) {
        let river = this.getRiver();
        for (let i = 0; i < river.length; ++i) {
            if (river[i] === cardId) {
                return true;
            }
        }
        return false;
    }

    calculateIncomeAmount(playerId, cardId) {
        if (empty(playerId) === false && empty(cardId) === false) {
            let player = this.getPlayerById(playerId);
            let card = this.getCardById(cardId);
            let playerCard = player.getCardById(cardId);
            let shoppingMall = player.getCardById(91);
            let incomeAmount = card.getIncomeAmount();
            if (shoppingMall.getIsBuilt() === true) {
                shoppingMall = this.getCardById(91);
                for (let i = 0; i < shoppingMall.getActivatedByTypeIds().length; ++i) {
                    if (shoppingMall.getActivatedByTypeIds()[i] === card.getTypeId()) {
                        incomeAmount += 1;
                        break;
                    }
                }
            }
            if (card.getActivatedByTypeIds().length === 0) {
                playerCard.setCalculatedIncomeAmount(incomeAmount * playerCard.getHowMany());
            } else {
                let playerCards = player.getCards();
                let howMany = 0;
                let typeIds = card.getActivatedByTypeIds();
                for (let t = 0; t < typeIds.length; ++t) {
                    let typeId = typeIds[t];
                    howMany += player.countCardsByTypeId(typeId);
                }
                playerCard.setCalculatedIncomeAmount((incomeAmount * playerCard.getHowMany()) * howMany);
            }
        }
    }

    calculatePurchasePrice(cardId) {
        let card = this.getCardById(cardId);
        if (this.getModifierLandmarksCostDouble() && card.getIsLandmark()) {
            return card.getPurchasePrice() * 2;
        } else {
            return card.getPurchasePrice();
        }
        return false;
    }

    addPlayer(name) {
        if (empty(name) === false) {
            let newPlayer = new Player();
            newPlayer.setName(name);
            newPlayer.setId(this.playerIdCounter);
            this.data().players.push(newPlayer);
            ++this.playerIdCounter;
            this.addAction(_DATA_STRINGS[13], {newPlayer});
        }
    }

    getTotalPlayers() {
        return this.getPlayers().length;
    }

    setDefaultMoney(updatedValue) {
        if (empty(updatedValue) === false) {
            this.data().defaults.money = updatedValue;
            return true;
        }
        return false;
    }

    getDefaultMoney() {
        return this.data().defaults.money;
    }

    giveMoneyFromPlayerToAnother(amount, from, to) {
        let fromPlayer = this.getPlayerById(from);
        let toPlayer = this.getPlayerById(to);
        if (fromPlayer.getMoney() >= amount) {
            toPlayer.addMoney(amount);
            fromPlayer.subtractMoney(amount);
            this.addAction(_DATA_STRINGS[12], {amount, fromPlayerId: from, toPlayerId: to, fromPlayer, toPlayer});
            return true;
        } else if (fromPlayer.getMoney() > 0) {
            toPlayer.addMoney(fromPlayer.getMoney());
            fromPlayer.subtractMoney(fromPlayer.getMoney());
            this.addAction(_DATA_STRINGS[12], {amount, fromPlayerId: from, toPlayerId: to, fromPlayer, toPlayer});
            return true;
        }
        return false;
    }

    giveMoneyToPlayerFromBank(amount, to) {
        let toPlayer = this.getPlayerById(to);
        toPlayer.addMoney(amount);
        this.addAction(_DATA_STRINGS[11], {amount, playerId: to, player: toPlayer});
        return true;
    }

    giveMoneyToPlayerFromAllOtherPlayers(amount, to) {
        for (var i = 0; i < this.getTotalPlayers(); ++i) {
            this.giveMoneyFromPlayerToAnother(amount, i, to);
        }
        // this.addAction('One player took money from all other players', [amount, to]);
        return true;
    }

    giveMoneyToBankFromPlayer(amount, from) {
        let fromPlayer = this.getPlayerById(from);
        fromPlayer.subtractMoney(amount);
        this.addAction(_DATA_STRINGS[10], {amount, player: fromPlayer});
        return true;
    }

    getResourceType(id) {
        return this.data().types[id];
    }
}
