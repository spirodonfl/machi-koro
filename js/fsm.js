class FSM {
    constructor() {
        this.state = 'uninitialized';
        this.action = 'nothing';
        this.states = {};
    }

    hasState(stateName) {
        if (this.states[stateName]) {
            return true;
        }
        return false;
    }

    currentStateHasAction(action) {
        if (this.hasState(this.state)) {
            if (this.states[this.state][action]) {
                return true;
            }
        }
        return false;
    }

    getCurrentStateAction(action) {
        if (this.currentStateHasAction(action)) {
            return this.states[this.state][action];
        }
        return false;
    }

    stateHasAction(stateName, action) {
        if (this.hasState(stateName)) {
            if (this.states[stateName][action]) {
                return true;
            }
        }
        return false;
    }

    doStatesExist() {
        if (this.states) {
            return true;
        }
        return false;
    }

    transition(state) {
        if (this.doStatesExist()) {
            if (this.hasState(state) === true) {
                if (this.currentStateHasAction('_onExit')) {
                    this.handle('_onExit');
                }
                this.state = state;
                if (this.currentStateHasAction('_onEnter')) {
                    this.handle('_onEnter');
                }
            }
        }
        return false;
    }

    handle() {
        let slice = [].slice;
        let action = arguments[0];
        let args = slice.call(arguments, 0);
        args = args.slice(1);

        if (this.doStatesExist()) {
            if (this.currentStateHasAction(action) === true) {
                this.action = action;
                this.stateAction = this.getCurrentStateAction(action);
                this.stateAction.apply(this, args);
            }
        }
        // return false;
    }

    defaultArbitraryState() {
        return {
            '_onEnter': () => {},
            '_onExit': () => {}
        }
    }
}