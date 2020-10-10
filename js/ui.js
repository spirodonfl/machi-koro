/** ANIMATION FUNCTIONS **/
// Taken from here: https://easings.net/#easeInCirc
class Animate {
    easeInCirc(x) {
        return 1 - Math.sqrt(1 - Math.pow(x, 2));
    }
    easeInSine(x) {
      return 1 - Math.cos(x * Math.PI / 2);
    }
    easeOutElastic(x) {
        const c4 = (2 * Math.PI) / 3;
        return x === 0
            ? 0
            : x === 1
            ? 1
            : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    }
    animate(duration = 1000, timing, draw) {
        const start = performance.now();
        window.requestAnimationFrame(function animate(time) {
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) {
                timeFraction = 1;
            }
            // var progress = timing(timeFraction);
            // var progress = easeOutElastic(timing(timeFraction));
            let progress = _ANIMATE.easeInSine(timing(timeFraction));
            draw(progress);
            if (timeFraction < 1) {
                window.requestAnimationFrame(animate);
            }
        });
    }
}

class AnimateGame extends Animate {
    splitCssRgbVariable(name) {
        let split = getComputedStyle(document.documentElement).getPropertyValue(name);
        split = split.replace(/[^\d,]/g, '').split(',');
        split[0] = parseInt(split[0]);
        split[1] = parseInt(split[1]);
        split[2] = parseInt(split[2]);
        return split;
    }

    diffRgbAnimation(pct, from, to) {
        let diff = [(to[0] - from[0]), (to[1] - from[1]), (to[2] - from[2])];
        let current = [diff[0] * pct, diff[1] * pct, diff[2] * pct];
        if (current[0] < 0) {
            current[0] = 0;
        }
        if (current[1] < 0) {
            current[1] = 0;
        }
        if (current[2] < 0) {
            current[2] = 0;
        }
        let applied = [(from[0] + current[0]), (from[1] + current[1]), (from[2] + current[2])];
        return applied;
    }

    // TODO: Is inverse really necessary? Maybe we just need to detect when from is greater than to and the other way around?
    diffRgbAnimationInverse(pct, from, to) {
        let diff = [(from[0] - to[0]), (from[1] - to[1]), (from[2] - to[2])];
        let current = [diff[0] * pct, diff[1] * pct, diff[2] * pct];
        if (current[0] < 0) {
            current[0] = 0;
        }
        if (current[1] < 0) {
            current[1] = 0;
        }
        if (current[2] < 0) {
            current[2] = 0;
        }
        let applied = [(from[0] - current[0]), (from[1] - current[1]), (from[2] - current[2])];
        return applied;
    }
}
let _ANIMATE = new AnimateGame();

class BaseUI {
    constructor() {
        this.calculateAspectRatioFitDocument();
        window.addEventListener('resize', () => {
            this.calculateAspectRatioFitDocument();
        });
    }

    calculateAspectRatioFitDocument() {
        let width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        let height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
        let ratio = this.calculateAspectRatioFit(60, 60, width, height);
        document.documentElement.style.setProperty('--document-width', width);
        document.documentElement.style.setProperty('--document-height', height);
        document.documentElement.style.setProperty('--ratio-width', ratio.width);
        document.documentElement.style.setProperty('--ratio-height', ratio.height);
    }

    calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
        var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
        return { width: srcWidth*ratio, height: srcHeight*ratio };
    }
}

class UI extends BaseUI {
    constructor() {
        super();

        this.debug = true;
        this.elements = {
            dice: document.getElementsByTagName('ui-die'),
            actions: document.getElementsByTagName('ui-action'),
            players: document.getElementsByTagName('ui-player'),
            riverCards: document.getElementsByTagName('ui-river-card'),
            landmarkCards: document.getElementsByTagName('ui-landmark-card'),
            establishmentCards: document.getElementsByTagName('ui-establishment-card'),
            cardsWrapper: document.getElementById('cards'),
            message: document.getElementsByTagName('ui-message')[0],
            menu: document.getElementsByTagName('ui-menu')[0],
            viewCards: document.getElementsByTagName('ui-view-cards'),
            done: document.getElementsByTagName('ui-done')[0]
        };
        this.index = {
            action: 0,
            riverCardElement: 0,
            playerElement: 0
        };
        this.animations = {
            playerNameFlashes: 0,
            messageFlashes: 0,
            cardFlashes: 0,
            playerCoinsFlashes: 0,
            playerLandmarksFlashes: 0,
            cardPlayerFlashes: 0,
            diceFlashes: 0,
            dieRolled: 0
        };
        this.chosen = {
            player: 0,
            card: 0
        };
        this.animatedMessages = [24, 57, 58, 28, 27, 12, 13, 9, 14, 15, 22, 40, 23, 17, 29, 0, 1, 19, 16, 2, 3, 4, 10, 26, 7, 8, 11];
        // TODO: Should we add 69 to above array for error messages?

        this.calculateAspectRatioFitDocument();
        window.addEventListener('resize', () => {
            this.calculateAspectRatioFitDocument();
        });
    }

    setup() {
        this.elements.message.model = {
            message: 'setting up'
        };
        this.elements.message.update();

        for (let i = 0; i < this.elements.players.length; ++i) {
            let uiPlayer = this.elements.players[i];
            uiPlayer.disable();
        }

        for (let i = 0; i < this.elements.viewCards.length; ++i) {
            let uiViewCards = this.elements.viewCards[i];
            uiViewCards.update();
            uiViewCards.addEventListener('click', (event) => {
                if (event.target.model.id === 'landmarks') {
                    _UI.scrollToCard(_UI.elements.landmarkCards.flat()[0]);
                } else if (event.target.model.id === 'establishments') {
                    _UI.scrollToCard(_UI.elements.establishmentCards.flat()[0]);
                } else if (event.target.model.id === 'river') {
                    _UI.scrollToCard(_UI.elements.riverCards[0]);
                }
            });
        }

        this.elements.menu.addEventListener('click', (event) => {
            // TODO: This. Menu open
        });

        var cardIndex = 0;
        let gameRiverCards = _G.getRiver();
        if (gameRiverCards.length < 10) {
            let diff = 10 - gameRiverCards.length;
            let end = this.elements.riverCards.length - 1;
            while (diff > 0) {
                this.elements.riverCards[end].remove();
                delete(this.elements.riverCards[end]);
                --end;
                --diff;
            }
        }

        let establishmentCards = [];
        cardIndex = 0;
        for (let i = 0; i < _DATA_CARDS.length; ++i) {
            let dataCard = _DATA_CARDS[i];
            let card = _G.getCardById(dataCard.id);
            if (card.getIsLandmark() === false) {
                let uiCard = this.elements.establishmentCards[cardIndex];
                ++cardIndex;
                establishmentCards[dataCard.id] = uiCard;
                uiCard.model = {
                    id: card.getId(),
                    activations: card.getActivatedByDiceTotal(),
                    resource: _DATA_RESOURCE_TYPE_STRINGS[card.getTypeId()],
                    name: card.getName(),
                    description: card.getDescription(),
                    income: card.getIncomeAmount(),
                    price: card.getPurchasePrice(),
                    // TODO: Make the below more readable
                    players: [
                        (_G.getPlayerById(0) && _G.getPlayerById(0).getCardById(card.getId())) ? _G.getPlayerById(0).getCardById(card.getId()).getHowMany() : 0,
                        (_G.getPlayerById(1) && _G.getPlayerById(1).getCardById(card.getId())) ? _G.getPlayerById(1).getCardById(card.getId()).getHowMany() : 0,
                        (_G.getPlayerById(2) && _G.getPlayerById(2).getCardById(card.getId())) ? _G.getPlayerById(2).getCardById(card.getId()).getHowMany() : 0,
                        (_G.getPlayerById(3) && _G.getPlayerById(3).getCardById(card.getId())) ? _G.getPlayerById(3).getCardById(card.getId()).getHowMany() : 0
                    ],
                    action: {
                        text: 'activate',
                        class: 'activate'
                    }
                };
                uiCard.update();
            }
        }
        this.elements.establishmentCards = establishmentCards;

        let landmarkCards = [];
        cardIndex = 0;
        for (let i = 0; i < _DATA_CARDS.length; ++i) {
            let dataCard = _DATA_CARDS[i];
            let card = _G.getCardById(dataCard.id);
            if (card.getIsLandmark() === true) {
                let uiCard = this.elements.landmarkCards[cardIndex];
                ++cardIndex;
                landmarkCards[dataCard.id] = uiCard;
                uiCard.model = {
                    id: card.getId(),
                    activations: card.getActivatedByDiceTotal(),
                    resource: _DATA_RESOURCE_TYPE_STRINGS[card.getTypeId()],
                    name: card.getName(),
                    description: card.getDescription(),
                    income: card.getIncomeAmount(),
                    price: card.getPurchasePrice(),
                    // TODO: Make the below more readable
                    players: [
                        (_G.getPlayerById(0) && _G.getPlayerById(0).getCardById(card.getId())) ? _G.getPlayerById(0).getCardById(card.getId()).getHowMany() : 0,
                        (_G.getPlayerById(1) && _G.getPlayerById(1).getCardById(card.getId())) ? _G.getPlayerById(1).getCardById(card.getId()).getHowMany() : 0,
                        (_G.getPlayerById(2) && _G.getPlayerById(2).getCardById(card.getId())) ? _G.getPlayerById(2).getCardById(card.getId()).getHowMany() : 0,
                        (_G.getPlayerById(3) && _G.getPlayerById(3).getCardById(card.getId())) ? _G.getPlayerById(3).getCardById(card.getId()).getHowMany() : 0
                    ],
                    action: {
                        text: 'build',
                        class: 'build'
                    }
                };
                uiCard.update();
            }
        }
        this.elements.landmarkCards = landmarkCards;

        this.addAllEventListeners();
    }

    eventCompleted(event, tagName, eventType) {
        if (eventType === 'flash-off') {
            if (tagName === 'ui-message') {
                ++_UI.animations.messageFlashes;
            } else if (tagName === 'ui-player') {
                ++_UI.animations.playerNameFlashes;
            } else if (tagName === 'ui-river-card' || tagName === 'ui-establishment-card' || tagName === 'ui-landmark-card') {
                ++_UI.animations.cardFlashes;
            } else if (tagName === 'ui-die') {
                ++_UI.animations.diceFlashes;
            } else {
                if (_UI.debug) { console.trace(tagName, eventType); }
            }
            this.handleEventCompleted(event, tagName, eventType);
        } else if (eventType === 'player-flash-off') {
            if (tagName === 'ui-establishment-card' || tagName === 'ui-river-card' || tagName === 'ui-landmark-card') {
                ++_UI.animations.cardPlayerFlashes;
            } else {
                if (_UI.debug) { console.trace(tagName, eventType); }
            }
            this.handleEventCompleted(event, tagName, eventType);
        } else if (eventType === 'player-coins-flash-off') {
            if (tagName === 'ui-player') {
                ++_UI.animations.playerCoinsFlashes;
            } else {
                if (_UI.debug) { console.trace(tagName, eventType); }
            }
            this.handleEventCompleted(event, tagName, eventType);
        } else if (eventType === 'player-landmarks-flash-off') {
            if (tagName === 'ui-player') {
                ++_UI.animations.playerLandmarksFlashes;
            } else {
                if (_UI.debug) { console.trace(tagName, eventType); }
            }
            this.handleEventCompleted(event, tagName, eventType);
        } else if (eventType === 'die-rolled') {
            if (tagName === 'ui-die') {
                ++_UI.animations.dieRolled;
            } else {
                if (_UI.debug) { console.trace(tagName, eventType); }
            }
            this.handleEventCompleted(event, tagName, eventType);
        } else {
            this.handleUserAction(event, tagName, eventType);
        }
    }

    handleEventCompleted(event, tagName, eventType) {
        if (_UI.debug) { console.log('Original "handleEventCompleted"'); }
    }

    handleUserAction(event, tagName, eventType) {
        if (_UI.debug) { console.log('Original "handleUserAction"'); }
    }

    addAllEventListeners() {
        for (let i = 0; i < _UI.elements.riverCards.length; ++i) {
            let uiCard = _UI.elements.riverCards[i];
            if (uiCard === undefined) { continue; }
            _UI.addEventListeners(uiCard);
        }

        for (let i = 0; i < _UI.elements.landmarkCards.length; ++i) {
            let uiCard = _UI.elements.landmarkCards[i];
            if (uiCard === undefined) { continue; }
            _UI.addEventListeners(uiCard);
        }

        for (let i = 0; i < _UI.elements.establishmentCards.length; ++i) {
            let uiCard = _UI.elements.establishmentCards[i];
            if (uiCard === undefined) { continue; }
            _UI.addEventListeners(uiCard);
        }

        for (let i = 0; i < _UI.elements.dice.length; ++i) {
            let uiDie = _UI.elements.dice[i];
            _UI.addEventListeners(uiDie);
        }

        for (let i = 0; i < _UI.elements.players.length; ++i) {
            let uiPlayer = _UI.elements.players[i];
            if (uiPlayer === undefined) { continue; }
            _UI.addEventListeners(uiPlayer);
        }

        _UI.addEventListeners(_UI.elements.done);

        // Menu and view cards remain consistent but here they are just in case
        // _UI.addEventListeners(_UI.elements.menu);
        // for (let i = 0; i < _UI.elements.viewCards.length; ++i) {
        //     let uiViewCards = _UI.elements.viewCards[i];
        //     _UI.addEventListeners(uiViewCards);
        // }

        _UI.addEventListeners(_UI.elements.message);
        
        return true;
    }

    removeAllEventListeners() {
        for (let i = 0; i < _UI.elements.riverCards.length; ++i) {
            let uiCard = _UI.elements.riverCards[i];
            if (uiCard === undefined) { continue; }
            _UI.removeEventListeners(uiCard);
        }

        for (let i = 0; i < _UI.elements.landmarkCards.length; ++i) {
            let uiCard = _UI.elements.landmarkCards[i];
            if (uiCard === undefined) { continue; }
            _UI.removeEventListeners(uiCard);
        }

        for (let i = 0; i < _UI.elements.establishmentCards.length; ++i) {
            let uiCard = _UI.elements.establishmentCards[i];
            if (uiCard === undefined) { continue; }
            _UI.removeEventListeners(uiCard);
        }

        for (let i = 0; i < _UI.elements.dice.length; ++i) {
            let uiDie = _UI.elements.dice[i];
            _UI.removeEventListeners(uiDie);
        }

        for (let i = 0; i < _UI.elements.players.length; ++i) {
            let uiPlayer = _UI.elements.players[i];
            if (uiPlayer === undefined) { continue; }
            _UI.removeEventListeners(uiPlayer);
        }

        _UI.removeEventListeners(_UI.elements.done);

        // Menu and view cards remain consistent but here they are just in case
        // _UI.removeEventListeners(_UI.elements.menu);
        // for (let i = 0; i < _UI.elements.viewCards.length; ++i) {
        //     let uiViewCards = _UI.elements.viewCards[i];
        //     _UI.removeEventListeners(uiViewCards);
        // }

        _UI.removeEventListeners(_UI.elements.message);

        return true;
    }

    removeEventListeners(element) {
        let events = element.getEvents();
        for (let i = 0; i < events.length; ++i) {
            element.removeEventListener(events[i], _UI.gameEventListener);
        }
        return true;
    }

    addEventListeners(element) {
        let events = element.getEvents();
        for (let i = 0; i < events.length; ++i) {
            element.addEventListener(events[i], _UI.gameEventListener);
        }
        return true;
    }

    listenToEvents(element) {
        _UI.removeEventListeners(element);
        _UI.addEventListeners(element);
        return true;
    }

    resetAnimationCounts() {
        for (let i in this.animations) {
            this.animations[i] = 0;
        }
        return true;
    }

    scrollToCard(element) {
        let cardsWrapper = this.elements.cardsWrapper;
        let from = cardsWrapper.scrollLeft;
        let to = (element.offsetLeft - 200);
        _ANIMATE.animate(500, (t) => {
            if (t === 1) {
                // Nothing
            }
            return t;
        }, (pct) => {
            let diff = from - to;
            let current = diff * pct;
            let applied = from - current;
            cardsWrapper.scrollLeft = applied;
        });
    }

    gameEventListener(event) {
        let tagName = event.target.tagName.toLowerCase();
        for (let i in _UI.animations) {
            if (_UI.animations[i] >= 2) {
                if (_UI.debug) { console.log('Animation overrun %s from tag %s', i, event.target.tagName); }
            }
        }
        _UI.eventCompleted(event, tagName, event.type);
        return false;
    }

    message(message, data) {
        if (data === undefined) {
            data = [];
        }
        for (let i = 0; i < data.length; ++i) {
            message = message.replace('{' + i + '}', data[i]);
        }
        return message;
    }

    save() {
        // TODO: Determine when it's appropriate to actually save. You don't want to save on EVERY action necessarily
        let games = localStorage.getItem(storageDbName);
        games = games.split(',');
        for (let i = 0; i < games.length; ++i) {
            if (games[i] === thisGame) {
                localStorage.setItem(thisGame, JSON.stringify({data: _G.data(), uiIndexes: this.index, players: [this.elements.players[0].model.name, this.elements.players[1].model.name, this.elements.players[2].model.name, this.elements.players[3].model.name]}));
            }
        }
    }

    readAction() {
        this.resetAnimationCounts();
        this.save();
        this.handleUserAction = (event, tagName, eventType) => {
            if (_UI.debug) { console.log('Empty "handleUserAction"'); }
        }
        this.handleEventCompleted = (event, tagName, eventType) => {
            if (_UI.debug) { console.log('Empty "handleEventCompleted"'); }
        }
        let actions = _G.getActions();
        let actionData = _G.getActionData();
        if (this.index.action >= actions.length) {
            if (_UI.debug) { console.log('Index overrun %d / %d', _UI.index.action, actions.length); }
            this.index.action = actions.length;
            return false;
        }
        let message = actions[this.index.action];
        let data = JSON.parse(actionData[this.index.action]);
        if (_UI.debug) { console.log('Message from "readAction" is "%s" (index action is %d)', message, this.index.action); }

        let uiMessage = this.elements.message;
        let uiDone = this.elements.done;
        if (message === _DATA_STRINGS[69]) {
            if (_UI.debug) { console.log(69, data); }
            // error
            let errorMessage = _G.messages.error[(_G.messages.error.length - 1)];
            let errorData = _G.messages.data[(_G.messages.data.length - 1)];
            let lastState = _G.last.state;
            let lastAction = _G.last.action;
            if (_UI.debug) { console.log('error', {errorMessage, errorData, lastState, lastAction}); }
            uiMessage.model.message = _UI.message(errorMessage, []);
            uiMessage.update();
            _UI.handleEventCompleted = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1) {
                    ++_UI.index.action;
                    _UI.readAction();
                }
            }
            uiMessage.flash();
        } else if (message === _DATA_STRINGS[24]) {
            if (_UI.debug) { console.log(24, data); }
            // game finished. rolling player won
            uiMessage.model.message = _UI.message(_DATA_STRINGS[115], [_G.getRollingPlayer().getName()]);
            uiMessage.update();
            _UI.handleEventCompleted = (event, tagName, eventType) => {
                // Nothing...
            }
            uiMessage.flash();
        } else if (message === _DATA_STRINGS[57]) {
            if (_UI.debug) { console.log(57, data); } // data.cardId, data.cardName, data.player
            // removed card from player
            // let player = _G.loadPlayer(data.player._data);
            // TODO: Fix the above. For whatever reason, the card data isn't being loaded correctly and the ids of the cards end up being 0 across the board
            let player = _G.getPlayerById(data.player._data.id);
            let card = _G.getCardById(data.cardId);
            let uiPlayer = this.elements.players[player.getId()];
            let uiCard = this.elements.establishmentCards[card.getId()];
            if (player.getCardById(card.getId())) {
                uiCard.model.players[player.getId()] = player.getCardById(card.getId()).getHowMany();
            } else {
                uiCard.model.players[player.getId()] = 0;
            }
            uiCard.update();
            this.scrollToCard(uiCard);
            uiMessage.model.message = _UI.message(_DATA_STRINGS[59], [player.getName(), card.getName()]);
            uiMessage.update();
            let whichPlayer = ['one', 'two', 'three', 'four'];
            whichPlayer = whichPlayer[player.getId()];
            _UI.handleEventCompleted = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1 && _UI.animations.cardPlayerFlashes === 1 && _UI.animations.playerNameFlashes === 1) {
                    ++_UI.index.action;
                    _UI.readAction();
                }
            }
            uiCard.flashPlayer(player.getId());
            uiMessage.flash();
            uiPlayer.flash();
        } else if (message === _DATA_STRINGS[58]) {
            console.log(58, data); // data.cardId, data.cardName, data.player
            // removed landmark from player
            // TODO: This (not urgent)
        } else if (message === _DATA_STRINGS[28]) {
            if (_UI.debug) { console.log(28, data); }
            // rolling player rolling again
            uiMessage.model.message = _UI.message(_DATA_STRINGS[114], [_G.getRollingPlayer().getName()]);
            uiMessage.update();
            _UI.handleEventCompleted = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1) {
                    ++_UI.index.action;
                    _UI.readAction();
                }
            }
            uiMessage.flash();
        } else if (message === _DATA_STRINGS[27]) {
            if (_UI.debug) { console.log(27, data); } // data.playerId, data.targetPlayerId, data.targetCardId
            // one player traded cards with another player
            let playerTo = _G.getPlayerById(data.playerId);
            let playerFrom = _G.getPlayerById(data.targetPlayerId);
            let playerCard = false;
            let card = _G.getCardById(data.targetCardId);
            for (let i = 0; i < this.elements.players.length; ++i) {
                let uiPlayer = this.elements.players[i];
                if (uiPlayer.model.id === data.playerId || uiPlayer.model.id === data.targetPlayerId) {
                    playerCard = uiPlayer;
                }
            }
            uiMessage.model.message = _UI.message(_DATA_STRINGS[55], [playerTo.getName(), card.getName(), playerFrom.getName()]);
            uiMessage.update();
            let whichPlayer = ['one', 'two', 'three', 'four'];
            _UI.handleEventCompleted = (event, tagName, eventType) => {
                // We want to flash two players so we're ok with multiple player name flashes
                if (_UI.animations.messageFlashes === 1 && _UI.animations.playerNameFlashes > 0) {
                    ++_UI.index.action;
                    _UI.readAction();
                }
            }
            playerCard.flash();
            uiMessage.flash();
        } else if (message === _DATA_STRINGS[12]) {
            if (_UI.debug) { console.log(12, data); } // data.fromPlayerId, data.toPlayerId, data.fromPlayer, data.toPlayer, data.amount
            // one player gave money to another
            let playerTo = _G.loadPlayer(data.toPlayer._data);
            let playerFrom = _G.loadPlayer(data.fromPlayer._data);
            let playerToCard = false;
            let playerFromCard = false;
            for (let i = 0; i < this.elements.players.length; ++i) {
                let uiPlayer = this.elements.players[i];
                if (uiPlayer.model.id === data.fromPlayerId) {
                    uiPlayer.model.coins = playerFrom.getMoney();
                    uiPlayer.update();
                    playerFromCard = uiPlayer;
                } else if (uiPlayer.model.id === data.toPlayerId) {
                    uiPlayer.model.coins = playerTo.getMoney();
                    uiPlayer.update();
                    playerToCard = uiPlayer;
                }
            }
            uiMessage.model.message = _UI.message(_DATA_STRINGS[56], [playerFrom.getName(), playerTo.getName(), data.amount]);
            uiMessage.update();
            _UI.handleUserAction = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1 && _UI.animations.playerCoinsFlashes > 1) {
                    ++_UI.index.action;
                    _UI.readAction();
                }
            }
            playerFromCard.flashCoins();
            playerToCard.flashCoins();
            uiMessage.flash();
        } else if (message === _DATA_STRINGS[13]) {
            if (_UI.debug) { console.log(13, data); }
            // added player
            let player = _G.loadPlayer(data.newPlayer._data);
            let uiPlayer = this.elements.players[this.index.playerElement];
            let indexAsText = ['one', 'two', 'three', 'four'];

            uiPlayer.model = {
                id: player.getId(),
                name: player.getName(),
                landmarks: 0,
                coins: player.getMoney(),
                class: 'player-' + indexAsText[this.index.playerElement]
            };
            uiPlayer.update();
            uiPlayer.enable();
            uiMessage.model.message = _UI.message(_DATA_STRINGS[41], [player.getName()]);
            uiMessage.update();
            _UI.handleEventCompleted = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1 && _UI.animations.playerNameFlashes === 1) {
                    ++_UI.index.action;
                    ++_UI.index.playerElement;
                    _UI.readAction();
                } else {
                    if (_UI.debug) { console.log('Not ready to handle "%s"', _DATA_STRINGS[13]); }
                }
            }
            uiMessage.flash();
            uiPlayer.flash();
        } else if (message === _DATA_STRINGS[14]) {
            if (_UI.debug) { console.log(14, data); }
            // Remove card from river
            // TODO: Should be UI driven with a wiping out of card data so it's blank, then added back later
            let cardId = data.cardId;
            for (let i = 0; i < this.elements.riverCards.length; ++i) {
                let uiCard = this.elements.riverCards[i];
                if (uiCard.model.id === cardId) {
                    this.index.riverCardElement = i;
                    break;
                }
            }
            ++this.index.action;
            _UI.readAction();
        } else if (message === _DATA_STRINGS[15]) {
            if (_UI.debug) { console.log(15, data); }
            // Add card to river
            let card = _G.getCardById(data.cardId);
            let uiCard = this.elements.riverCards[this.index.riverCardElement];
            uiCard.model = {
                id: data.cardId,
                activations: card.getActivatedByDiceTotal(),
                resource: _DATA_RESOURCE_TYPE_STRINGS[card.getTypeId()],
                name: card.getName(),
                description: card.getDescription(),
                income: card.getIncomeAmount(),
                price: card.getPurchasePrice(),
                // TODO: Make the below more readable
                players: [
                    (_G.getPlayerById(0) && _G.getPlayerById(0).getCardById(data.cardId)) ? _G.getPlayerById(0).getCardById(data.cardId).getHowMany() : 0,
                    (_G.getPlayerById(1) && _G.getPlayerById(1).getCardById(data.cardId)) ? _G.getPlayerById(1).getCardById(data.cardId).getHowMany() : 0,
                    (_G.getPlayerById(2) && _G.getPlayerById(2).getCardById(data.cardId)) ? _G.getPlayerById(2).getCardById(data.cardId).getHowMany() : 0,
                    (_G.getPlayerById(3) && _G.getPlayerById(3).getCardById(data.cardId)) ? _G.getPlayerById(3).getCardById(data.cardId).getHowMany() : 0
                ],
                action: {
                    text: 'purchase',
                    class: 'purchase'
                }
            };
            uiCard.update();
            this.scrollToCard(uiCard);
            uiMessage.model.message = _UI.message(_DATA_STRINGS[43]);
            uiMessage.update();
            _UI.handleEventCompleted = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1 && _UI.animations.cardFlashes === 1) {
                    ++_UI.index.action;
                    ++_UI.index.riverCardElement;
                    _UI.readAction();
                }
            }
            uiCard.flash();
            uiMessage.flash();
        } else if (message === _DATA_STRINGS[22]) {
            if (_UI.debug) { console.log(22, data); }
            // gave card to player
            // let player = _G.loadPlayer(data.player._data);
            // TODO: Fix the above. For whatever reason, the card data isn't being loaded correctly and the ids of the cards end up being 0 across the board
            let player = _G.getPlayerById(data.player._data.id);
            let card = _G.getCardById(data.cardId);
            let uiPlayer = this.elements.players[player.getId()];
            let uiCard = this.elements.establishmentCards[card.getId()];
            uiCard.model.players[player.getId()] = player.getCardById(card.getId()).getHowMany();
            uiCard.update();
            this.scrollToCard(uiCard);
            uiMessage.model.message = _UI.message(_DATA_STRINGS[44], [player.getName(), card.getName()]);
            uiMessage.update();
            let whichPlayer = ['one', 'two', 'three', 'four'];
            whichPlayer = whichPlayer[player.getId()];
            _UI.handleEventCompleted = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1 && _UI.animations.cardPlayerFlashes === 1 && _UI.animations.playerNameFlashes === 1) {
                    ++_UI.index.action;
                    _UI.readAction();
                }
            }
            uiCard.flashPlayer(player.getId());
            uiMessage.flash();
            uiPlayer.flash();
        } else if (message === _DATA_STRINGS[40]) {
            if (_UI.debug) { console.log(40, data); }
            // gave landmark to player
            let player = _G.loadPlayer(data.player._data);
            let card = _G.getCardById(data.cardId);
            let uiPlayer = this.elements.players[player.getId()];
            let uiCard = this.elements.landmarkCards[card.getId()];
            this.scrollToCard(uiCard);
            uiMessage.model.message = _UI.message(_DATA_STRINGS[44], [player.getName(), card.getName()]);
            uiMessage.update();
            let whichPlayer = ['one', 'two', 'three', 'four'];
            whichPlayer = whichPlayer[player.getId()];
            _UI.handleEventCompleted = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1 && _UI.animations.cardPlayerFlashes === 1 && _UI.animations.playerNameFlashes === 1) {
                    ++_UI.index.action;
                    _UI.readAction();
                }
            }
            uiCard.flashPlayer(player.getId());
            uiMessage.flash();
            uiPlayer.flash();
        } else if (message === _DATA_STRINGS[23]) {
            if (_UI.debug) { console.log(23, data); }
            // gave money to player
            let player = _G.loadPlayer(data.player._data);
            let uiPlayer = this.elements.players[player.getId()];
            uiPlayer.model.coins = player.getMoney();
            uiPlayer.update();
            uiMessage.model.message = _UI.message(_DATA_STRINGS[45], [player.getName(), data.amount]);
            uiMessage.update();
            _UI.handleEventCompleted = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1 && _UI.animations.playerCoinsFlashes === 1) {
                    ++_UI.index.action;
                    _UI.readAction();
                }
            }
            uiPlayer.flashCoins();
            uiMessage.flash();
        } else if (message === _DATA_STRINGS[17]) {
            if (_UI.debug) { console.log(17, data); }
            // setting turn player
            let uiPlayer = this.elements.players[data.updatedValue];
            let player = _G.getPlayerById(data.updatedValue);
            uiMessage.model.message = _UI.message(_DATA_STRINGS[46], [player.getName()]);
            uiMessage.update();
            _UI.handleEventCompleted = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1 && _UI.animations.playerNameFlashes === 1) {
                    ++_UI.index.action;
                    _UI.readAction();
                }
            }
            uiPlayer.flash();
            uiMessage.flash();
        } else if (message === _DATA_STRINGS[29]) {
            if (_UI.debug) { console.log(29, data); }
            // set starting player
            let uiPlayer = this.elements.players[data.id];
            let player = _G.getPlayerById(data.id);
            uiMessage.model.message = _UI.message(_DATA_STRINGS[47], [player.getName()]);
            uiMessage.update();
            _UI.handleEventCompleted = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1 && _UI.animations.playerNameFlashes === 1) {
                    ++_UI.index.action;
                    _UI.readAction();
                }
            }
            uiPlayer.flash();
            uiMessage.flash();
        } else if (message === _DATA_STRINGS[0]) {
            if (_UI.debug) { console.log(0, data); }
            // Waiting to roll
            this.elements.dice[1].disable();
            let uiPlayer = this.elements.players[data.id];
            uiPlayer.unStarName(); // In case it's starred because of "gets another turn"
            let player = _G.getPlayerById(data.id);
            if (_G.getRollingPlayer().getCanRollTwoDie()) {
                this.elements.dice[1].enable();
                uiMessage.model.message = _UI.message(_DATA_STRINGS[49], [player.getName()]);
                this.elements.dice[1].flash();
            } else {
                uiMessage.model.message = _UI.message(_DATA_STRINGS[48], [player.getName()]);
            }
            uiMessage.update();
            _UI.handleUserAction = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1 && _UI.animations.playerNameFlashes === 1 && _UI.animations.diceFlashes >= 1) {
                    if (tagName === 'ui-die' && eventType === 'click' && event.target.dataset.id === 'die-one') {
                        _G.fsm().handle('roll', 1);
                        ++_UI.index.action;
                        _UI.readAction();
                    } else if (tagName === 'ui-die' && eventType === 'click' && event.target.dataset.id === 'die-two' && _G.getRollingPlayer().getCanRollTwoDie()) {
                        _G.fsm().handle('roll', 2);
                        ++_UI.index.action;
                        _UI.readAction();
                    } else {
                        if (_UI.debug) { console.trace(tagName, eventType); }
                    }
                }
            }
            this.elements.dice[0].flash();
            uiPlayer.flash();
            uiMessage.flash();
        } else if (message === _DATA_STRINGS[1]) {
            if (_UI.debug) { console.log(1, data); }
            // player choose to roll again
            uiMessage.model.message = _DATA_STRINGS[111];
            uiMessage.update();
            _UI.handleUserAction = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1) {
                    if (tagName === 'ui-done' && (eventType === 'click' || eventType === 'done-clicked')) {
                        _G.fsm().handle('choose to roll again', false);
                        ++_UI.index.action;
                        _UI.readAction();
                    } else if (tagName === 'ui-die' && eventType === 'click') {
                        _G.fsm().handle('choose to roll again', true);
                        ++_UI.index.action;
                        _UI.readAction();
                    } else {
                        if (_UI.debug) { console.trace(tagName, eventType); }
                    }
                }
            }
            uiMessage.flash();
        } else if (message === _DATA_STRINGS[19]) {
            if (_UI.debug) { console.log(19, data); }
            // setting rolling player gets another turn
            if (data.updatedValue === true) {
                uiMessage.model.message = _UI.message(_DATA_STRINGS[112], data.playerId);
                uiMessage.update();
                let uiPlayer = this.elements.players[data.id];
                uiPlayer.starName();
                _UI.handleEventCompleted = (event, tagName, eventType) => {
                    if (_UI.animations.messageFlashes === 1) {
                        ++_UI.index.action;
                        _UI.readAction();
                    }
                }
                uiMessage.flash();
            } else {
                ++_UI.index.action;
                _UI.readAction();
            }
        } else if (message === _DATA_STRINGS[16]) {
            if (_UI.debug) { console.log(16, data); }
            // die was rolled
            _UI.handleEventCompleted = (event, tagName, eventType) => {
                if (_UI.animations.dieRolled >= 1) {
                    if (data.which === 0) {
                        _UI.elements.dice[0].model.value = _G.getDie(0);
                        _UI.elements.dice[0].update();
                    }
                    if (data.which === 1) {
                        _UI.elements.dice[1].model.value = _G.getDie(1);
                        _UI.elements.dice[1].update();
                    }
                    ++_UI.index.action;
                    _UI.readAction();
                }
            }
            if (data.which === 0 && data.updatedValue > 0) {
                this.elements.dice[0].roll();
            } else if (data.which === 1 && data.updatedValue > 0) {
                this.elements.dice[1].roll();
            } else {
                ++this.index.action;
                _UI.readAction();
            }
        } else if (message === _DATA_STRINGS[2]) {
            if (_UI.debug) { console.log(2, data); }
            // Wait for player to take turn (end or activate)
            let uiPlayer = this.elements.players[data.id];
            let player = _G.getPlayerById(data.id);
            uiMessage.model.message = _UI.message(_DATA_STRINGS[50], [player.getName()]);
            uiMessage.update();
            _UI.handleUserAction = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1 && _UI.animations.playerNameFlashes === 1) {
                    if (tagName === 'ui-done' && (eventType === 'click' || eventType === 'done-clicked')) {
                        _G.fsm().handle('end turn');
                        ++_UI.index.action;
                        _UI.readAction();
                    } else if (tagName === 'ui-establishment-card' && eventType === 'card-button-clicked') {
                        _G.fsm().handle('activate card', event.target.model.id);
                        ++_UI.index.action;
                        _UI.readAction();
                    } else {
                        if (_UI.debug) { console.trace(tagName, eventType); }
                    }
                }
            }
            uiPlayer.flash();
            uiMessage.flash();
        } else if (message === _DATA_STRINGS[3]) {
            if (_UI.debug) { console.log(3, data); }
            // Rolling player is taking their turn
            let player = _G.getPlayerById(data.id);
            uiMessage.model.message = _UI.message(_DATA_STRINGS[53], [player.getName()]);
            uiMessage.update();
            _UI.handleUserAction = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1) {
                    if (tagName === 'ui-landmark-card' && eventType === 'card-button-clicked') {
                        _G.fsm().handle('build landmark', event.target.model.id);
                        ++_UI.index.action;
                        _UI.readAction();
                    } else if (tagName === 'ui-river-card' && eventType === 'card-button-clicked') {
                        _G.fsm().handle(_DATA_STRINGS[103], event.target.model.id);
                        ++_UI.index.action;
                        _UI.readAction();
                    } else if (tagName === 'ui-done' && (eventType === 'click' || eventType === 'done-clicked')) {
                        _G.fsm().handle(_DATA_STRINGS[98]);
                        ++_UI.index.action;
                        _UI.readAction();
                    } else {
                        if (_UI.debug) { console.trace(tagName, eventType); }
                    }
                }
            }
            uiMessage.flash();
        } else if (message === _DATA_STRINGS[4]) {
            if (_UI.debug) { console.log(4, data); }
            // Player activated card
            let player = _G.loadPlayer(data.player._data);
            let card = _G.getCardById(data.cardId);
            let uiCard = this.elements.establishmentCards[data.cardId];
            let uiPlayer = this.elements.players[player.getId()];
            uiMessage.model.message = _UI.message(_DATA_STRINGS[51], [player.getName(), card.getName()]);
            uiMessage.update();
            _UI.handleEventCompleted = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1 && _UI.animations.playerNameFlashes === 1 && _UI.animations.cardFlashes === 1) {
                    ++_UI.index.action;
                    _UI.readAction();
                }
            }
            uiPlayer.flash();
            uiMessage.flash();
            uiCard.flash();
        } else if (message === _DATA_STRINGS[10]) {
            if (_UI.debug) { console.log(10, data); }
            // Player gave money to bank
            let player = _G.loadPlayer(data.player._data);
            let uiPlayer = this.elements.players[player.getId()];
            uiPlayer.model.coins = player.getMoney();
            uiPlayer.update();
            uiMessage.model.message = _UI.message(_DATA_STRINGS[110], [player.getName(), data.amount]);
            uiMessage.update();
            _UI.handleEventCompleted = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1 && _UI.animations.playerCoinsFlashes === 1) {
                    ++_UI.index.action;
                    _UI.readAction();
                }
            }
            uiPlayer.flashCoins();
            uiMessage.flash();
        } else if (message === _DATA_STRINGS[26]) {
            if (_UI.debug) { console.log(26, data); }
            // built landmark
            let uiCard = this.elements.landmarkCards[data.cardId];
            let card = _G.getCardById(data.cardId);
            let player = _G.getPlayerById(data.playerId);
            uiCard.model.players[player.getId()] = 1; // Should always be 1
            uiCard.update();
            let uiPlayer = this.elements.players[player.getId()];
            uiPlayer.model.landmarks = player.getLandmarksBuilt();
            uiPlayer.update();
            uiMessage.model.message = _UI.message(_DATA_STRINGS[52], [player.getName(), card.getName()]);
            uiMessage.update();
            let whichPlayer = ['one', 'two', 'three', 'four'];
            whichPlayer = whichPlayer[player.getId()];
            _UI.handleEventCompleted = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1 && _UI.animations.playerLandmarksFlashes === 1 && _UI.animations.cardPlayerFlashes === 1) {
                    ++_UI.index.action;
                    _UI.readAction();
                }
            }
            uiPlayer.flashLandmarks();
            uiCard.flashPlayer(player.getId());
            uiMessage.flash();
        } else if (message === _DATA_STRINGS[7]) {
            if (_UI.debug) { console.log(7, data); } // data.playerId
            // Player chooses another player to trade cards with
            // TODO: Move below two variables to somewhere global in _UI?
            let targetPlayerId = false;
            let targetCardId = false;
            _UI.handleUserAction = (event, tagName, eventType) => {
                if (tagName === 'ui-player' && eventType === 'click') {
                    targetPlayerId = event.target.model.id;
                    console.log('targetPlayerId %d', targetPlayerId);
                    event.target.highlight();
                    for (let i = 0; i < _UI.elements.establishmentCards.length; ++i) {
                        let uiCard = _UI.elements.establishmentCards[i];
                        if (uiCard.model.players[targetPlayerId] > 0) {
                            uiCard.model.action.text = 'Choose this card';
                            uiCard.update();
                        }
                    }
                } else if (tagName === 'ui-establishment-card' && eventType === 'card-button-clicked') {
                    targetCardId = event.target.model.id;
                    console.log('targetCardId %d', targetCardId);
                    event.target.highlight();
                } else if (tagName === 'ui-done' && (eventType === 'click' || eventType === 'done-clicked')) {
                    console.log('DONE', [targetPlayerId, targetCardId]);
                    for (let i = 0; i < this.elements.players.length; ++i) {
                        this.elements.players[i].unhighlight();
                    }
                    for (let i = 0; i < this.elements.establishmentCards.length; ++i) {
                        this.elements.establishmentCards[i].unhighlight();
                    }
                    // TODO: Confirmation popup to make sure
                    if (targetPlayerId !== false && targetCardId !== false) {
                        _G.fsm().handle(_DATA_STRINGS[93], targetPlayerId, targetCardId);
                    } else {
                        _G.fsm().handle(_DATA_STRINGS[98]);
                    }
                    ++_UI.index.action;
                    _UI.readAction();
                } else {
                    if (_UI.debug) { console.trace(tagName, eventType); }
                }
            }
            uiMessage.model.message = _DATA_STRINGS[109];
            uiMessage.update();
            uiMessage.flash();
        } else if (message === _DATA_STRINGS[8]) {
            if (_UI.debug) { console.log(8, data); } // data.playerId
            // Player chooses another player to take money from
            let targetPlayerId = false;
            _UI.handleUserAction = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1) {
                    if (tagName === 'ui-player' && eventType === 'click') {
                        targetPlayerId = event.target.model.id;
                        event.target.highlight();
                    } else if (tagName === 'ui-done' && (eventType === 'click' || eventType === 'done-clicked')) {
                        for (let i = 0; i < this.elements.players.length; ++i) {
                            this.elements.players[i].unhighlight();
                        }
                        // TODO: Confirmation popup to make sure
                        if (targetPlayerId !== false) {
                            _G.fsm().handle(_DATA_STRINGS[92], data.cardId, targetPlayerId);
                        } else {
                            _G.fsm().handle(_DATA_STRINGS[98]);
                        }
                        ++_UI.index.action;
                        _UI.readAction();
                    } else {
                        if (_UI.debug) { console.trace(tagName, eventType); }
                    }
                }
            }
            uiMessage.model.message = _DATA_STRINGS[108];
            uiMessage.update();
            uiMessage.flash();
        } else if (message === _DATA_STRINGS[11]) {
            if (_UI.debug) { console.log(11, data); } // data.amount, data.playerId, data.player
            // One player took money from bank
            let player = _G.getPlayerById(data.playerId);
            let uiPlayer = this.elements.players[data.playerId];
            uiPlayer.model.coins = player.getMoney();
            uiPlayer.update();
            uiMessage.model.message = _UI.message(_DATA_STRINGS[113], [player.getName(), data.amount]);
            uiMessage.update();
            _UI.handleEventCompleted = (event, tagName, eventType) => {
                if (_UI.animations.messageFlashes === 1 && _UI.animations.playerCoinsFlashes === 1) {
                    ++_UI.index.action;
                    _UI.readAction();
                }
            }
            uiPlayer.flashCoins();
            uiMessage.flash();
        } else {
            if (_UI.debug) { console.log('Message from "readAction" is being handled in "readAction" as a non-animated action'); }
            ++this.index.action;
            _UI.readAction();
        }
    }
}

let _UI = false;
let _G = false;
let thisGame = false;
let storageDbName = 'games';
window.addEventListener('load', () => {
    _G = new Game();
    _UI = new UI();

    let createGameForm = document.getElementsByTagName('create-game-form')[0];
    let games = localStorage.getItem(storageDbName);
    if (empty(games) === false) {
        games = games.split(',');
        if (games.length > 0) {
            createGameForm.updateGames(games);
        }
    }
    createGameForm.addEventListener('delete-clicked', (event) => {
        let gameId = event.detail.gameId;
        let games = localStorage.getItem(storageDbName);
        games = games.split(',');
        for (let i = 0; i < games.length; ++i) {
            if (games[i] === gameId) {
                games.splice(i, 1);
                localStorage.removeItem(gameId);
            }
        }
        localStorage.setItem(storageDbName, games);
        createGameForm.updateGames(games);
    });
    createGameForm.addEventListener('load-clicked', (event) => {
        let gameId = event.detail.gameId;
        let games = localStorage.getItem(storageDbName);
        games = games.split(',');
        for (let i = 0; i < games.length; ++i) {
            if (games[i] === gameId) {
                thisGame = gameId;
                createGameForm.style.display = 'none';
                let load = JSON.parse(localStorage.getItem(thisGame));
                _G.loadGame(load.data);
                _UI.setup();
                for (let c = 0; c < _G.data().river.length; ++c) {
                    let card = _G.data().river[c];
                    card = _G.getCardById(card);
                    let uiCard = _UI.elements.riverCards[c];
                    uiCard.model = {
                        id: card.getId(),
                        activations: card.getActivatedByDiceTotal(),
                        resource: _DATA_RESOURCE_TYPE_STRINGS[card.getTypeId()],
                        name: card.getName(),
                        description: card.getDescription(),
                        income: card.getIncomeAmount(),
                        price: card.getPurchasePrice(),
                        // TODO: Make the below more readable
                        players: [
                            (_G.getPlayerById(0) && _G.getPlayerById(0).getCardById(card.getId())) ? _G.getPlayerById(0).getCardById(card.getId()).getHowMany() : 0,
                            (_G.getPlayerById(1) && _G.getPlayerById(1).getCardById(card.getId())) ? _G.getPlayerById(1).getCardById(card.getId()).getHowMany() : 0,
                            (_G.getPlayerById(2) && _G.getPlayerById(2).getCardById(card.getId())) ? _G.getPlayerById(2).getCardById(card.getId()).getHowMany() : 0,
                            (_G.getPlayerById(3) && _G.getPlayerById(3).getCardById(card.getId())) ? _G.getPlayerById(3).getCardById(card.getId()).getHowMany() : 0
                        ],
                        action: {
                            text: 'purchase',
                            class: 'purchase'
                        }
                    };
                    uiCard.update();
                }
                for (let p = 0; p < _G.data().players.length; ++p) {
                    let uiPlayer = _UI.elements.players[p];
                    uiPlayer.model.name = _G.data().players[p].getName();
                    uiPlayer.model.coins = _G.data().players[p].getMoney();
                    uiPlayer.model.landmarks = _G.data().players[p].getLandmarksBuilt();
                    uiPlayer.update();
                    uiPlayer.enable();
                }
                for (let i = 0; i < _UI.elements.players.length; ++i) {
                    let uiPlayer = _UI.elements.players[i];
                    if (empty(uiPlayer.model.name) === true || uiPlayer.model.name === false) {
                        uiPlayer.disable();
                    }
                }
                _UI.elements.dice[0].model.value = _G.getDie(0);
                _UI.elements.dice[0].update();
                _UI.elements.dice[1].model.value = _G.getDie(1);
                _UI.elements.dice[1].update();
                _UI.readAction();
                break;
            }
        }
    });
    createGameForm.addEventListener('create-clicked', (event) => {
        createGameForm.style.display = 'none';
        _G.newGame();
        _G.fsm().transition('waiting for players');
        if (empty(event.detail.playerOne) === false) {
            _G.fsm().handle('create player', event.detail.playerOne);
        }
        if (empty(event.detail.playerTwo) === false) {
            _G.fsm().handle('create player', event.detail.playerTwo);
        }
        if (empty(event.detail.playerThree) === false) {
            _G.fsm().handle('create player', event.detail.playerThree);
        }
        if (empty(event.detail.playerFour) === false) {
            _G.fsm().handle('create player', event.detail.playerFour);
        }
        if (empty(event.detail.gameId) === false) {
            thisGame = event.detail.gameId;
            let games = localStorage.getItem(storageDbName);
            if (empty(games) === false) {
                games = games.split(',');
            } else {
                games = [];
            }
            games.push(thisGame);
            localStorage.setItem(storageDbName, games);

            _G.fsm().handle('start game');
            _G.giveMoneyToPlayer(100, _G.getPlayerById(0));
            _G.giveMoneyToPlayer(100, _G.getPlayerById(1));
            _G.giveMoneyToPlayer(100, _G.getPlayerById(2));
            _G.giveCardToPlayer(6, 0);
            _G.giveCardToPlayer(6, 1);
            _G.giveCardToPlayer(6, 2);
            _G.giveCardToPlayer(7, 0);
            _G.giveCardToPlayer(7, 1);
            _G.giveCardToPlayer(7, 2);
            _UI.setup();
            _UI.readAction();
        }
    });
});