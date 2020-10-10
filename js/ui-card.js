class UICard extends BaseHTMLElement {
    getTemplate() {
        this.html = /* syntax: html */`
<!-- If we wanted to bring in only "as-needed" stylesheets -->
<!-- <link href="./css/core.css" rel="stylesheet" />
<link href="./css/card.css" rel="stylesheet" /> -->
<link href="./css/main.css" rel="stylesheet" />
<div class="card">
    <div class="activations single-line-centered">&nbsp;</div>
    <div class="name-resource">
        <div class="name single-line-centered">&nbsp;</div>
        <div class="resource single-line-centered">&nbsp;</div>
    </div>
    <div class="description">&nbsp;</div>
    <div class="income-price">
        <div class="income single-line-centered">&nbsp;</div>
        <div class="price single-line-centered">&nbsp;</div>
    </div>
    <div class="players">
        <div class="player-one single-line-centered">&nbsp;</div>
        <div class="player-two single-line-centered">&nbsp;</div>
        <div class="player-three single-line-centered">&nbsp;</div>
        <div class="player-four single-line-centered">&nbsp;</div>
    </div>
    <div class="button action single-line-centered">&nbsp;</div>
</div>
        `;
    }

    initialize() {
        super.initialize();

        this.elements.card = this.rootEl.getElementsByClassName('card')[0];
        this.elements.activations = this.rootEl.getElementsByClassName('activations')[0];
        this.elements.name = this.rootEl.getElementsByClassName('name')[0];
        this.elements.resource = this.rootEl.getElementsByClassName('resource')[0];
        this.elements.description = this.rootEl.getElementsByClassName('description')[0];
        this.elements.income = this.rootEl.getElementsByClassName('income')[0];
        this.elements.price = this.rootEl.getElementsByClassName('price')[0];
        this.elements.playerOne = this.rootEl.getElementsByClassName('player-one')[0];
        this.elements.playerTwo = this.rootEl.getElementsByClassName('player-two')[0];
        this.elements.playerThree = this.rootEl.getElementsByClassName('player-three')[0];
        this.elements.playerFour = this.rootEl.getElementsByClassName('player-four')[0];
        this.elements.button = this.rootEl.getElementsByClassName('button')[0];

        this.rootEl.addEventListener('click', (event) => {
            if (event.srcElement.classList.contains('button') === true) {
                this.dispatchEvent(new CustomEvent('card-button-clicked', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        id: this.model.id,
                        action: this.model.action.text
                    }
                }));
            }
        });

        this.addEventListener('flash-on', (event) => {
            this.flash();
        });
        this.addEventListener('flash-off', (event) => {});
        this.addEventListener('player-one-flash-on', (event) => {
            this.flashPlayer(0);
        });
        this.addEventListener('player-one-flash-off', (event) => {});
        this.addEventListener('player-two-flash-on', (event) => {
            this.flashPlayer(1);
        });
        this.addEventListener('player-two-flash-off', (event) => {});
        this.addEventListener('player-three-flash-on', (event) => {
            this.flashPlayer(2);
        });
        this.addEventListener('player-three-flash-off', (event) => {});
        this.addEventListener('player-four-flash-on', (event) => {
            this.flashPlayer(3);
        });
        this.addEventListener('player-four-flash-off', (event) => {});
        this.addEventListener('player-flash-off', (event) => {});
    }

    enable() {
        if (this.elements.card.classList.contains('disabled') === true) {
            this.elements.card.classList.remove('disabled');
        }
    }

    disable() {
        if (this.elements.card.classList.contains('disabled') === false) {
            this.elements.card.classList.add('disabled');
        }
    }

    getEvents() {
        return [
            'flash-off',
            'player-one-flash-off',
            'player-two-flash-off',
            'player-three-flash-off',
            'player-four-flash-off',
            'player-flash-off',
            'card-button-clicked',
            'click'
        ];
    }

    update() {
        this.model.flash = 0;
        this.updateActivations();
        this.updateName();
        this.updateResourceType();
        this.updateDescription();
        this.updateIncome();
        this.updatePrice();
        this.updatePlayerOneCount();
        this.updatePlayerTwoCount();
        this.updatePlayerThreeCount();
        this.updatePlayerFourCount();
        this.updateButton();
    }

    updateButton() {
        let classList = this.elements.button.classList;
        if (classList.length > 3) {
            for (let i = 3; i < classList.length; ++i) {
                classList.remove(classList[i]);
            }
        }
        classList.add(this.model.action.class);
        this.elements.button.textContent = this.model.action.text;
    }

    updateActivations() {
        this.elements.activations.textContent = this.model.activations.join(' ');
    }

    updateName() {
        this.elements.name.textContent = this.model.name;
    }

    updateResourceType() {
        this.elements.resource.textContent = this.model.resource;
        let resourceAsClass = this.model.resource.replace(/ /g, '-');
        if (this.elements.card.classList.contains(resourceAsClass) === false) {
            this.elements.card.classList.add(resourceAsClass);
        }
    }

    updateDescription() {
        this.elements.description.textContent = this.model.description;
    }

    updateIncome() {
        this.elements.income.textContent = 'Income: ' + this.model.income;
    }

    updatePrice() {
        this.elements.price.textContent = 'Price: ' + this.model.price;
    }

    updatePlayerOneCount() {
        this.elements.playerOne.textContent = this.model.players[0];
    }

    updatePlayerTwoCount() {
        this.elements.playerTwo.textContent = this.model.players[1];
    }

    updatePlayerThreeCount() {
        this.elements.playerThree.textContent = this.model.players[2];
    }

    updatePlayerFourCount() {
        this.elements.playerFour.textContent = this.model.players[3];
    }

    flash() {
        let offName = '--card-bg-off';
        let off = _ANIMATE.splitCssRgbVariable(offName);
        let onName = '--card-bg-on';
        let on = _ANIMATE.splitCssRgbVariable(onName);
        let mainElement = this.elements.card;
        let offEventName = 'flash-off';
        let onEventName = 'flash-on';
        let animationSeconds = 300;

        if (this.model.flash === 0) {
            _ANIMATE.animate(animationSeconds, (t) => {
                if (t === 1) {
                    mainElement.style.backgroundColor = 'var(' + offName + ')';
                    this.model.flash = 1;
                    this.dispatchEvent(new CustomEvent(onEventName, {
                        bubbles: true,
                        composed: true
                    }));
                }
                return t;
            }, (pct) => {
                let applied = _ANIMATE.diffRgbAnimation(pct, on, off);
                mainElement.style.backgroundColor = 'rgb(' + applied[0] + ', ' + applied[1] + ', ' + applied[2] + ')';
            });
        } else {
            _ANIMATE.animate(animationSeconds, (t) => {
                if (t === 1) {
                    mainElement.style.backgroundColor = 'var(' + onName + ')';
                    this.model.flash = 0;
                    this.dispatchEvent(new CustomEvent(offEventName, {
                        bubbles: true,
                        composed: true
                    }));
                }
                return t;
            }, (pct) => {
                let applied = _ANIMATE.diffRgbAnimationInverse(pct, off, on);
                mainElement.style.backgroundColor = 'rgb(' + applied[0] + ', ' + applied[1] + ', ' + applied[2] + ')';
            });
        }
    }

    flashPlayer(which) {
        let mainElement = false;
        if (which === 0) {
            which = 'one';
            mainElement = this.elements.playerOne;
        } else if (which === 1) {
            which = 'two';
            mainElement = this.elements.playerTwo;
        } else if (which === 2) {
            which = 'three';
            mainElement = this.elements.playerThree;
        } else if (which === 3) {
            which = 'four';
            mainElement = this.elements.playerFour;
        }
        let offName = '--player-' + which + '-color-light';
        let off = _ANIMATE.splitCssRgbVariable(offName);
        let onName = '--player-' + which + '-color';
        let on = _ANIMATE.splitCssRgbVariable(onName);
        let offEventName = 'player-' + which + '-flash-off';
        let onEventName = 'player-' + which + '-flash-on';
        let animationSeconds = 300;

        if (this.model.flash === 0) {
            _ANIMATE.animate(animationSeconds, (t) => {
                if (t === 1) {
                    mainElement.style.backgroundColor = 'var(' + offName + ')';
                    this.model.flash = 1;
                    this.dispatchEvent(new CustomEvent(onEventName, {
                        bubbles: true,
                        composed: true
                    }));
                    this.dispatchEvent(new CustomEvent('player-flash-off', {
                        bubbles: true,
                        composed: true
                    }));
                }
                return t;
            }, (pct) => {
                let applied = _ANIMATE.diffRgbAnimation(pct, on, off);
                mainElement.style.backgroundColor = 'rgb(' + applied[0] + ', ' + applied[1] + ', ' + applied[2] + ')';
            });
        } else {
            _ANIMATE.animate(animationSeconds, (t) => {
                if (t === 1) {
                    mainElement.style.backgroundColor = 'var(' + onName + ')';
                    this.model.flash = 0;
                    this.dispatchEvent(new CustomEvent(offEventName, {
                        bubbles: true,
                        composed: true
                    }));
                }
                return t;
            }, (pct) => {
                let applied = _ANIMATE.diffRgbAnimationInverse(pct, off, on);
                mainElement.style.backgroundColor = 'rgb(' + applied[0] + ', ' + applied[1] + ', ' + applied[2] + ')';
            });
        }
    }

    highlight() {
        this.elements.card.classList.add('highlight');
    }

    unhighlight() {
        this.elements.card.classList.remove('highlight');
    }

    shake() {
        // TODO: This
    }
}

class UIRiverCard extends UICard {}

class UILandmarkCard extends UICard {}

class UIEstablishmentCard extends UICard {}

customElements.define('ui-river-card', UIRiverCard);
customElements.define('ui-landmark-card', UILandmarkCard);
customElements.define('ui-establishment-card', UIEstablishmentCard);