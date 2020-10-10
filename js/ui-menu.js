class UIMenu extends BaseHTMLElement {
    getTemplate() {
        this.html = /* syntax: html */`
<link href="./css/main.css" rel="stylesheet" />
<div class="action menu single-line-centered">menu</div>
        `;
    }

    initialize() {
        super.initialize();

        this.elements.menu = this.rootEl.getElementsByClassName('menu')[0];

        this.rootEl.addEventListener('click', (event) => {
            if (event.srcElement.classList.contains('menu') === true) {
                this.dispatchEvent(new CustomEvent('menu-clicked', {
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
            'menu-clicked',
            'click'
        ];
    }

    update() {
        this.disable();
        if (this.model.disabled === undefined) {
            this.enable();
        }
    }

    enable() {
        if (this.elements.menu.classList.contains('disabled') === true) {
            this.model.disabled = false;
            this.elements.menu.classList.remove('disabled');
        }
    }

    disable() {
        if (this.elements.menu.classList.contains('disabled') === false) {
            this.model.disabled = true;
            this.elements.menu.classList.add('disabled');
        }
    }

    flash() {
        // TODO: This flash is not pronounced enough
        // TODO: The css variables
        let offName = '--menu-bg-off';
        let off = _ANIMATE.splitCssRgbVariable(offName);
        let onName = '--menu-bg-on';
        let on = _ANIMATE.splitCssRgbVariable(onName);
        let mainElement = this.elements.menu;
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
customElements.define('ui-menu', UIMenu);