class UIMessage extends BaseHTMLElement {
    getTemplate() {
        this.html = /* syntax: html */`
<link href="./css/main.css" rel="stylesheet" />
<div class="message single-line-centered">Super duper awesome message can go here and stuff</div>
        `;
    }

    initialize() {
        super.initialize();

        this.elements.message = this.rootEl.getElementsByClassName('message')[0];

        if (this.model.message) {
            this.updateMessage();
        }

        this.addEventListener('flash-on', (event) => {
            this.flash();
        });
        this.addEventListener('flash-off', (event) => {});
    }

    update() {
        if (this.model.flash === undefined) {
            this.model.flash = 0;
        }
        if (this.model.message === undefined) {
            this.model.message = false;
        }
        this.updateMessage();
    }

    getEvents() {
        return ['click', 'flash-off'];
    }

    updateMessage() {
        this.elements.message.textContent = this.model.message;
    }

    flash() {
        let offName = '--message-bg-off';
        let off = _ANIMATE.splitCssRgbVariable(offName);
        let onName = '--message-bg-on';
        let on = _ANIMATE.splitCssRgbVariable(onName);
        let mainElement = this.elements.message;
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
customElements.define('ui-message', UIMessage);