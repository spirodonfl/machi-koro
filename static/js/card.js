class Card extends HTMLElement {
    getTemplate () {
        return `
<div class="die">2</div>
<div class="type">Staple Food</div>
<div class="name">General Store</div>
<div class="price">0</div>
<div class="description">If you have less than 2 constructed landmarks, get 2 coins from the bank on your turn only.</div>
        `;
    }

    set model (model) {
        this._model = model;
    }

    get model () {
        return this._model;
    }

    set properties (properties) {
        this._properties = properties;
    }

    get properties () {
        return this._properties;
    }

    constructor () {
        super();

        this._properties = {};
        this._model = {};
        this._elements = {};
        this.template = false; // Either a string or document.querySelector('template')
        this.template = document.createElement('template');
        this.template.innerHTML = this.getTemplate();
    }

    initialize () {
        this.root = this.attachShadow({ mode: 'open' });
        let shared = document.querySelector('template#x-shared');
        if (shared instanceof HTMLElement) {
            this.root.appendChild(shared.content.cloneNode(true));
        }
        this.root.appendChild(this.template.content.cloneNode(true));
    }

    connectedCallback () {
        this.initialize();
        // When attached in DOM, do stuff
    }

    disconnectedCallback () {
        // When detached from DOM, do stuff
    }

    static get observedAttributes () {
        return [];
    }

    // attributeChangedCallback (attributeName, oldValue, newValue) {}
}
customElements.define('mk-card', Card);