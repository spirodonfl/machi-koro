class BaseHTMLElement extends HTMLElement {
    getTemplate() {
        this.html = /* syntax: html */`<div>base element</div>`;
    }

    set model(model) {
        this._model = model;
    }
    get model() {
        return this._model;
    }

    set properties(properties) {
        this._properties = properties;
    }
    get properties() {
        return this._properties;
    }

    set elements(elements) {
        this._elements = elements;
    }
    get elements() {
        return this._elements;
    }

    constructor() {
        super();

        this._properties = {};

        this._model = {};

        this._elements = {};

        this.template = document.createElement('template');
    }

    connectedCallback() {
        this.initialize();
    }

    disconnectedCallback() {}

    static get observedAttributes() { return []; }

    attributeChangeCallback(attributeName, oldValue, newValue) {}

    initialize() {
        this.getTemplate();
        this.template.innerHTML = this.html;

        var rootElement = document.createElement('div');
        rootElement.id = 'root';
        this.root = this.attachShadow({mode: 'open'});
        this.root.appendChild(rootElement);
        let shared = document.querySelector('template#x-shared');
        if (shared instanceof HTMLElement) {
            this.root.children[0].appendChild(shared.content.cloneNode(true));
        }
        this.root.children[0].appendChild(this.template.content.cloneNode(true));
        this.rootEl = this.root.children[0];
    }

    render() {}
}
customElements.define('base-html-element', BaseHTMLElement);