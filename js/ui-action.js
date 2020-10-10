class UIAction extends BaseHTMLElement {
    getTemplate() {
        this.html = /* syntax: html */`
<link href="./css/main.css" rel="stylesheet" />
<div class="action single-line-centered"></div>
        `;
    }

    initialize() {
        super.initialize();

        this.elements.action = this.rootEl.getElementsByClassName('action')[0];

        if (this.dataset.id) {
            this.model.id = this.dataset.id;
            this.updateClass();
        }

        if (this.dataset.text) {
            this.model.text = this.dataset.text;
            this.updateText();
        }

        this.rootEl.addEventListener('click', (event) => {
            if (event.srcElement.classList.contains('action') === true) {
                this.dispatchEvent(new CustomEvent('action-clicked', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        id: this.dataset.id
                    }
                }));
            }
        });
    }

    getEvents() {
        return ['click', 'action-clicked'];
    }

    enable() {
        if (this.elements.action.classList.contains('disabled') === true) {
            this.elements.action.classList.remove('disabled');
        }
    }

    disable() {
        if (this.elements.action.classList.contains('disabled') === false) {
            this.elements.action.classList.add('disabled');
        }
    }

    updateClass() {
        this.elements.action.classList.add(this.model.id);
    }

    updateText() {
        this.elements.action.textContent = this.model.text;
    }

    flash() {
        // TODO: This
    }

    shake() {
        // TODO: This
    }
}
customElements.define('ui-action', UIAction);