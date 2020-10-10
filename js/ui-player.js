class UIPlayer extends BaseHTMLElement {
    getTemplate() {
        this.html = /* syntax: html */`
<link href="./css/main.css" rel="stylesheet" />
<div class="player">
    <div class="picture">
        <div class="img"></div>
    </div>
    <!-- TODO: Marquee the name -->
    <div class="name single-line-centered">Test</div>
    <div class="coins">
        <div class="coins-wrapper">
            <div class="coins-icon"></div>
            <div class="coins-count">30</div>
        </div>
    </div>
    <div class="landmarks">
        <div class="landmarks-wrapper">
            <div class="landmarks-icon"></div>
            <div class="landmarks-count">30</div>
        </div>
    </div>
</div>
        `;
    }

    initialize() {
        super.initialize();

        this.elements.player = this.rootEl.getElementsByClassName('player')[0];
        this.elements.picture = this.rootEl.getElementsByClassName('img')[0];
        this.elements.name = this.rootEl.getElementsByClassName('name')[0];
        this.elements.coinsWrapper = this.rootEl.getElementsByClassName('coins-wrapper')[0];
        this.elements.coins = this.rootEl.getElementsByClassName('coins-count')[0];
        this.elements.landmarksWrapper = this.rootEl.getElementsByClassName('landmarks-wrapper')[0];
        this.elements.landmarks = this.rootEl.getElementsByClassName('landmarks-count')[0];

        if (this.dataset.class) {
            this.model.class = this.dataset.class;
            this.updateClass();
        }

        if (this.model.flash === undefined) {
            this.model.flash = 0;
        }

        this.addEventListener('flash-on', (event) => {
            this.flash();
        });
        this.addEventListener('flash-off', (event) => {});
        this.addEventListener('player-coins-flash-on', (event) => {
            this.flashCoins();
        });
        this.addEventListener('player-coins-flash-off', (event) => {});
        this.addEventListener('player-landmarks-flash-on', (event) => {
            this.flashLandmarks();
        });
        this.addEventListener('player-landmarks-flash-off', (event) => {});
    }

    update() {
        this.model.flash = 0;
        this.updateCoins();
        this.updateName();
        this.updateBuiltLandmarkCount();
        this.updatePicture();
        this.updateClass();
    }

    getEvents() {
        return [
            'click',
            'flash-off',
            'player-coins-flash-off',
            'player-landmarks-flash-off'
        ];
    }

    enable() {
        if (this.elements.player.classList.contains('disabled') === true) {
            this.elements.player.classList.remove('disabled');
        }
    }

    disable() {
        if (this.elements.player.classList.contains('disabled') === false) {
            this.elements.player.classList.add('disabled');
        }
    }

    updateName() {
        this.elements.name.textContent = this.model.name;
    }

    starName() {
        this.elements.name.textContent = '* ' + this.model.name;
    }

    unStarName() {
        this.elements.name.textContent = this.model.name;
    }

    updateCoins() {
        this.elements.coins.textContent = this.model.coins;
    }

    updateClass() {
        if (this.elements.player.classList.contains(this.model.class) === false) {
            this.elements.player.classList.add(this.model.class);
        }
    }

    updateBuiltLandmarkCount() {
        this.elements.landmarks.textContent = this.model.landmarks;
    }

    updatePicture() {
        // TODO: This. How is this going to work if the "img" class is a background image?
    }

    flash() {
        let offName = '--' + this.model.class + '-name-bg-off';
        let off = _ANIMATE.splitCssRgbVariable(offName);
        let onName = '--' + this.model.class + '-name-bg-on';
        let on = _ANIMATE.splitCssRgbVariable(onName);
        let mainElement = this.elements.name;
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

    flashCoins() {
        let offName = '--player-coins-bg-off';
        let off = _ANIMATE.splitCssRgbVariable(offName);
        let onName = '--player-coins-bg-on';
        let on = _ANIMATE.splitCssRgbVariable(onName);
        let mainElement = this.elements.coinsWrapper;
        let offEventName = 'player-coins-flash-off';
        let onEventName = 'player-coins-flash-on';
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

    flashLandmarks() {
        let offName = '--player-landmarks-bg-off';
        let off = _ANIMATE.splitCssRgbVariable(offName);
        let onName = '--player-landmarks-bg-on';
        let on = _ANIMATE.splitCssRgbVariable(onName);
        let mainElement = this.elements.landmarksWrapper;
        let offEventName = 'player-landmarks-flash-off';
        let onEventName = 'player-landmarks-flash-on';
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

    highlight() {
        this.elements.name.classList.add('highlight');
    }

    unhighlight() {
        this.elements.name.classList.remove('highlight');
    }

    shake() {
        // TODO: This
    }
}
customElements.define('ui-player', UIPlayer);