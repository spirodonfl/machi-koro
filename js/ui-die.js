class UIDie extends BaseHTMLElement {
    getTemplate() {
        this.html = /* syntax: html */`
<!-- TODO: Cleanup die animations -->
<link href="./css/main.css" rel="stylesheet" />
<div class="die single-line-centered">0</div>
        `;
    }

    initialize() {
        super.initialize();

        this.elements.die = this.rootEl.getElementsByClassName('die')[0];

        if (this.dataset.id) {
            this.model.id = this.dataset.id;
            this.updateClass();
        }

        this.rootEl.addEventListener('click', (event) => {
            if (event.srcElement.classList.contains('die') === true) {
                this.dispatchEvent(new CustomEvent('die-clicked', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        id: this.model.id,
                        value: this.model.value
                    }
                }));
            }
        });
        this.addEventListener('flash-on', (event) => {
            this.flash();
        });
        this.addEventListener('flash-off', (event) => {});
    }

    getEvents() {
        return [
            'flash-off',
            'die-clicked',
            'click',
            'die-rolled'
        ];
    }

    update() {
        if (this.model.disabled === undefined) {
            this.model.disabled = false;
        }
        if (this.model.rolled === undefined) {
            this.model.rolled = 0;
        }
        this.updateValue();
    }

    enable() {
        if (this.elements.die.classList.contains('disabled') === true) {
            this.model.disabled = false;
            this.elements.die.classList.remove('disabled');
        }
    }

    disable() {
        if (this.elements.die.classList.contains('disabled') === false) {
            this.model.disabled = true;
            this.elements.die.classList.add('disabled');
        }
    }

    updateClass() {
        if (this.elements.die.classList.contains(this.model.id) === false) {
            this.elements.die.classList.add(this.model.id);
        }
    }

    updateValue() {
        this.elements.die.textContent = this.model.value;
    }

    roll() {
        this.model.rolled = 0;
        let skip = 0;
         _ANIMATE.animate(1250, (t) => {
            if (t === 1) {
                this.model.rolled = 1;
                this.dispatchEvent(new CustomEvent('die-rolled', {
                    bubbles: true,
                    composed: true
                }));
            }
            return t;
        }, (pct) => {
            if (skip === 5) {
                let rando = Math.floor(Math.random() * 6);
                ++rando;
                this.model.value = rando;
                this.updateValue();
                skip = 0;
            } else {
                ++skip;
            }
        });
    }

    flash() {
        // TODO: This flash is not pronounced enough
        let offName = '--die-bg-off';
        let off = _ANIMATE.splitCssRgbVariable(offName);
        let onName = '--die-bg-on';
        let on = _ANIMATE.splitCssRgbVariable(onName);
        let mainElement = this.elements.die;
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

    shake() {
        // TODO: This
    }
}
customElements.define('ui-die', UIDie);