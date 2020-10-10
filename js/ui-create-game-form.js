class CreateGameForm extends BaseHTMLElement {
    getTemplate() {
        this.html = /* syntax: html */`
<!-- If we wanted to bring in only "as-needed" stylesheets -->
<!-- <link href="./css/core.css" rel="stylesheet" />
<link href="./css/create-game-form.css" rel="stylesheet" /> -->
<link href="./css/main.css" rel="stylesheet" />
<style>
.input {
    margin-bottom: 20px;
    color: white;
    font-size: calc(var(--font-size) * 2.25);
}
input,
button,
textarea,
select {
    font-family: var(--font-family);
    letter-spacing: var(--letter-spacing);
}
input[type="text"] {
    padding: 10px;
    font-size: calc(var(--font-size) * 2.25);
}
input[type="checkbox"] {
    height: 32px;
    width: 32px;
    margin-right: 20px;
    vertical-align: bottom;
}
input[type="submit"] {
    padding: 10px;
    font-size: calc(var(--font-size) * 2.25);
}
h1 {
    color: white;
    margin: 0px;
    font-size: calc(var(--font-size) * 2.50);
    margin-bottom: 20px;
}
ul {
    list-style-type: none;
    margin: 0px;
    padding: 0px;
}
ul li span {
    margin-right: 10px;
}
ul li .load-button {
    font-size: calc(var(--font-size) * 2.25);
    margin-right: 10px;
}
ul li .delete-button {
    font-size: calc(var(--font-size) * 2.25);
}
.error {
    color: orange;
    font-size: calc(var(--font-size) * 2.25);
}
.games {
    display: none;
    color: white;
    padding: 10px;
    font-size: calc(var(--font-size) * 2.25);
}
</style>
<div style="height: 100%; background-color: black; text-align: center;">
    <div class="games"></div>
    <h1>Start A New Game</h1>
    <div class="input"><input type="text" name="game-id" class="game-id" placeholder="Name this game" /></div>
    <div class="input"><input type="text" name="player-one" class="player-one" placeholder="Name of Player 1" /></div>
    <div class="input"><input type="text" name="player-two" class="player-two" placeholder="Name of Player 2" /></div>
    <div class="input"><input type="text" name="player-three" class="player-three" placeholder="Name of Player 3" /></div>
    <div class="input"><input type="text" name="player-four" class="player-four" placeholder="Name of Player 4" /></div>
    <!--<div class="input"><input type="checkbox" name="modifier-landmarks-cost-double" /> Landmarks cost double</div>-->
    <div class="input"><input type="submit" class="submit-create-game" value="Start Game" /></div>
    <div class="error"></div>
</div>
        `;
    }

    initialize() {
        super.initialize();

        // TODO: Handle modifer

        this.elements.playerOne = this.rootEl.getElementsByClassName('player-one')[0];
        this.elements.playerTwo = this.rootEl.getElementsByClassName('player-two')[0];
        this.elements.playerThree = this.rootEl.getElementsByClassName('player-three')[0];
        this.elements.playerFour = this.rootEl.getElementsByClassName('player-four')[0];
        this.elements.gameId = this.rootEl.getElementsByClassName('game-id')[0];
        this.elements.error = this.rootEl.getElementsByClassName('error')[0];
        this.elements.games = this.rootEl.getElementsByClassName('games')[0];

        this.rootEl.addEventListener('click', (event) => {
            if (event.srcElement.classList.contains('submit-create-game')) {
                let howManyPlayers = 0;
                if (empty(this.elements.playerOne.value) === false) {
                    ++howManyPlayers;
                }
                if (empty(this.elements.playerTwo.value) === false) {
                    ++howManyPlayers;
                }
                if (empty(this.elements.playerThree.value) === false) {
                    ++howManyPlayers;
                }
                if (empty(this.elements.playerFour.value) === false) {
                    ++howManyPlayers;
                }
                if (howManyPlayers <= 1) {
                    this.elements.error.textContent = 'Need more than one player to play';
                } else {
                    if (empty(this.elements.gameId) === true) {
                        this.elements.error.textContent = 'Need to name the game';
                    } else {
                        this.dispatchEvent(new CustomEvent('create-clicked', {
                            bubbles: true,
                            composed: true,
                            detail: {
                                playerOne: this.elements.playerOne.value,
                                playerTwo: this.elements.playerTwo.value,
                                playerThree: this.elements.playerThree.value,
                                playerFour: this.elements.playerFour.value,
                                gameId: this.elements.gameId.value
                            }
                        }));
                    }
                }
            } else if (event.srcElement.classList.contains('delete-button')) {
                this.dispatchEvent(new CustomEvent('delete-clicked', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        gameId: event.srcElement.dataset.id
                    }
                }));
            } else if (event.srcElement.classList.contains('load-button')) {
                this.dispatchEvent(new CustomEvent('load-clicked', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        gameId: event.srcElement.dataset.id
                    }
                }));
            }
        });
    }

    updateGames(games) {
        this.elements.games.style.display = 'block';
        function deleteChildren(element) {
            for (let i = 0; i < element.children.length; ++i) {
                deleteChildren(element.children[i]);
                element.children[i].remove();
            }
        }
        deleteChildren(this.elements.games);
        if (games.length > 0) {
            let ul = document.createElement('ul');
            for (let i = 0; i < games.length; ++i) {
                let game = games[i];

                let loadButton = document.createElement('button');
                loadButton.textContent = 'Load';
                loadButton.dataset.id = game;
                loadButton.classList.add('load-button');

                let deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.dataset.id = game;
                deleteButton.classList.add('delete-button');

                let li = document.createElement('li');

                let span = document.createElement('span');
                span.textContent = game;
                li.appendChild(span);
                li.appendChild(loadButton);
                li.appendChild(deleteButton);
                ul.appendChild(li);
            }
            this.elements.games.appendChild(ul);
        }
    }
}
customElements.define('create-game-form', CreateGameForm);