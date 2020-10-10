class UIViewCards extends BaseHTMLElement {
    getTemplate() {
        this.html = /* syntax: html */`
<link href="./css/main.css" rel="stylesheet" />
<div class="action view-cards single-line-centered">
    <div class="icon"></div>
</div>
        `;
    }

    initialize() {
        super.initialize();

        this.elements.viewCards = this.rootEl.getElementsByClassName('view-cards')[0];
        this.elements.icon = this.rootEl.getElementsByClassName('icon')[0];

        this.elements.icon.classList.add(this.dataset.id + '-icon');

        this.rootEl.addEventListener('click', (event) => {
            if (event.srcElement.classList.contains('view-cards') === true) {
                this.dispatchEvent(new CustomEvent('view-cards-clicked', {
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
            'view-cards-clicked',
            'click'
        ];
    }

    update() {
        this.model.id = this.dataset.id;
        this.disable();
        if (this.model.disabled === undefined) {
            this.enable();
        }
    }

    enable() {
        if (this.elements.viewCards.classList.contains('disabled') === true) {
            this.model.disabled = false;
            this.elements.viewCards.classList.remove('disabled');
        }
    }

    disable() {
        if (this.elements.viewCards.classList.contains('disabled') === false) {
            this.model.disabled = true;
            this.elements.viewCards.classList.add('disabled');
        }
    }

    flash() {
        // TODO: This flash is not pronounced enough
        let offName = '--view-cards-bg-off';
        let off = _ANIMATE.splitCssRgbVariable(offName);
        let onName = '--view-cards-bg-on';
        let on = _ANIMATE.splitCssRgbVariable(onName);
        // TODO: The css variables
        // TODO: Better to flash the card, not the wrapper OR better yet remove the wrapper
        let mainElement = this.elements.viewCards;
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
customElements.define('ui-view-cards', UIViewCards);