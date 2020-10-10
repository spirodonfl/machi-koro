// TODO: Take this out of game-v2.js and apply appropriately
const _DATA_RESOURCE_TYPE_STRINGS = [];
_DATA_RESOURCE_TYPE_STRINGS[0] = 'crop';
_DATA_RESOURCE_TYPE_STRINGS[1] = 'animal husbandry';
_DATA_RESOURCE_TYPE_STRINGS[2] = 'staple food';
_DATA_RESOURCE_TYPE_STRINGS[3] = 'drinks and food';
_DATA_RESOURCE_TYPE_STRINGS[4] = 'factory';
_DATA_RESOURCE_TYPE_STRINGS[5] = 'natural resources';
_DATA_RESOURCE_TYPE_STRINGS[6] = 'major establishment';
_DATA_RESOURCE_TYPE_STRINGS[7] = 'market';
_DATA_RESOURCE_TYPE_STRINGS[8] = 'landmark';

// TODO: Complete the below strings and replacements
_DATA_CARD_STRINGS = [];
_DATA_CARD_STRINGS[0] = "wheat field";
_DATA_CARD_STRINGS[1] = "get 1 coin from the bank on anyones turn";

const _DATA_CARDS = [
    {
        "id": 0,
        "name": _DATA_CARD_STRINGS[0],
        "description": _DATA_CARD_STRINGS[1],
        "maximumAllowedToHave": 99,
        "can": {
            "othersSee": true,
            "beActivatedAnyTurn": true,
            "beActivatedThisTurn": false,
            "tradeOneCard": false
        },
        "typeId": 0,
        "purchasePrice": 1,
        "incomeAmount": 1,
        "is": {
            "landmark": false
        },
        "activatedBy": {
            "diceTotal": [1],
            "typeIds": []
        },
        "takeFrom": {
            "playerWhoRolled": false,
            "allOtherPlayers": false,
            "anyOnePlayer": false,
            "bank": true
        },
        "allows": {
            "rollingTwoDice": false,
            "takingAnotherTurnIfDiceMatch": false,
            "choosingToRollAgain": false
        }
    },
    {
        "id": 1,
        "name": "ranch",
        "description": "get 1 coin from the bank on anyones turn",
        "maximumAllowedToHave": 99,
        "can": {
            "othersSee": true,
            "beActivatedAnyTurn": true,
            "beActivatedThisTurn": false,
            "tradeOneCard": false
        },
        "typeId": 1,
        "purchasePrice": 1,
        "incomeAmount": 1,
        "is": {
            "landmark": false
        },
        "activatedBy": {
            "diceTotal": [1],
            "typeIds": []
        },
        "takeFrom": {
            "playerWhoRolled": false,
            "allOtherPlayers": false,
            "anyOnePlayer": false,
            "bank": true
        },
        "allows": {
            "rollingTwoDice": false,
            "takingAnotherTurnIfDiceMatch": false,
            "choosingToRollAgain": false
        }
    },
    {
        "id": 2,
        "name": "bakery",
        "description": "get 1 coin from the bank on your turn only",
        "maximumAllowedToHave": 99,
        "can": {
            "othersSee": true,
            "beActivatedAnyTurn": false,
            "beActivatedThisTurn": true,
            "tradeOneCard": false
        },
        "typeId": 1,
        "purchasePrice": 1,
        "incomeAmount": 1,
        "is": {
            "landmark": false
        },
        "activatedBy": {
            "diceTotal": [2],
            "typeIds": []
        },
        "takeFrom": {
            "playerWhoRolled": false,
            "allOtherPlayers": false,
            "anyOnePlayer": false,
            "bank": true
        },
        "allows": {
            "rollingTwoDice": false,
            "takingAnotherTurnIfDiceMatch": false,
            "choosingToRollAgain": false
        }
    },
    {
        "id": 3,
        "name": "cafe",
        "description": "get 1 coin from the player who rolled the dice",
        "maximumAllowedToHave": 99,
        "can": {
            "othersSee": true,
            "beActivatedAnyTurn": true,
            "beActivatedThisTurn": false,
            "tradeOneCard": false
        },
        "typeId": 3,
        "purchasePrice": 1,
        "incomeAmount": 1,
        "is": {
            "landmark": false
        },
        "activatedBy": {
            "diceTotal": [2, 3],
            "typeIds": []
        },
        "takeFrom": {
            "playerWhoRolled": true,
            "allOtherPlayers": false,
            "anyOnePlayer": false,
            "bank": false
        },
        "allows": {
            "rollingTwoDice": false,
            "takingAnotherTurnIfDiceMatch": false,
            "choosingToRollAgain": false
        }
    },
    {
        "id": 4,
        "name": "convenience store",
        "description": "get 3 coins from the bank on your turn only",
        "maximumAllowedToHave": 99,
        "can": {
            "othersSee": true,
            "beActivatedAnyTurn": false,
            "beActivatedThisTurn": true,
            "tradeOneCard": false
        },
        "typeId": 2,
        "purchasePrice": 2,
        "incomeAmount": 3,
        "is": {
            "landmark": false
        },
        "activatedBy": {
            "diceTotal": [4],
            "typeIds": []
        },
        "takeFrom": {
            "playerWhoRolled": false,
            "allOtherPlayers": false,
            "anyOnePlayer": false,
            "bank": true
        },
        "allows": {
            "rollingTwoDice": false,
            "takingAnotherTurnIfDiceMatch": false,
            "choosingToRollAgain": false
        }
    },
    {
        "id": 5,
        "name": "forest",
        "description": "get 1 coin from the bank on anyones turn",
        "maximumAllowedToHave": 99,
        "can": {
            "othersSee": true,
            "beActivatedAnyTurn": true,
            "beActivatedThisTurn": false,
            "tradeOneCard": false
        },
        "typeId": 5,
        "purchasePrice": 3,
        "incomeAmount": 1,
        "is": {
            "landmark": false
        },
        "activatedBy": {
            "diceTotal": [5],
            "typeIds": []
        },
        "takeFrom": {
            "playerWhoRolled": false,
            "allOtherPlayers": false,
            "anyOnePlayer": false,
            "bank": true
        },
        "allows": {
            "rollingTwoDice": false,
            "takingAnotherTurnIfDiceMatch": false,
            "choosingToRollAgain": false
        }
    },
    {
        "id": 6,
        "name": "business centre",
        "description": "if this is your turn trade 1 non major establishment with another player",
        "maximumAllowedToHave": 1,
        "can": {
            "othersSee": true,
            "beActivatedAnyTurn": false,
            "beActivatedThisTurn": true,
            "tradeOneCard": true
        },
        "typeId": 6,
        "purchasePrice": 8,
        "incomeAmount": 0,
        "is": {
            "landmark": false
        },
        "activatedBy": {
            "diceTotal": [6],
            "typeIds": []
        },
        "takeFrom": {
            "playerWhoRolled": false,
            "allOtherPlayers": false,
            "anyOnePlayer": true,
            "bank": false
        },
        "allows": {
            "rollingTwoDice": false,
            "takingAnotherTurnIfDiceMatch": false,
            "choosingToRollAgain": false
        }
    },
    {
        "id": 7,
        "name": "tv station",
        "description": "if this is your turn take 5 coins from any one player",
        "maximumAllowedToHave": 1,
        "can": {
            "othersSee": true,
            "beActivatedAnyTurn": false,
            "beActivatedThisTurn": true,
            "tradeOneCard": false
        },
        "typeId": 6,
        "purchasePrice": 7,
        "incomeAmount": 5,
        "is": {
            "landmark": false
        },
        "activatedBy": {
            "diceTotal": [6],
            "typeIds": []
        },
        "takeFrom": {
            "playerWhoRolled": false,
            "allOtherPlayers": false,
            "anyOnePlayer": true,
            "bank": false
        },
        "allows": {
            "rollingTwoDice": false,
            "takingAnotherTurnIfDiceMatch": false,
            "choosingToRollAgain": false
        }
    },
    {
        "id": 8,
        "name": "stadium",
        "description": "get 2 coins from all players on your turn only",
        "maximumAllowedToHave": 1,
        "can": {
            "othersSee": true,
            "beActivatedAnyTurn": false,
            "beActivatedThisTurn": true,
            "tradeOneCard": false
        },
        "typeId": 6,
        "purchasePrice": 6,
        "incomeAmount": 2,
        "is": {
            "landmark": false
        },
        "activatedBy": {
            "diceTotal": [6],
            "typeIds": []
        },
        "takeFrom": {
            "playerWhoRolled": false,
            "allOtherPlayers": true,
            "anyOnePlayer": false,
            "bank": false
        },
        "allows": {
            "rollingTwoDice": false,
            "takingAnotherTurnIfDiceMatch": false,
            "choosingToRollAgain": false
        }
    },
    {
        "id": 9,
        "name": "cheese factory",
        "description": "if this is your turn get 3 coins from the bank for each animal husbandry establishment that you own",
        "maximumAllowedToHave": 99,
        "can": {
            "othersSee": true,
            "beActivatedAnyTurn": false,
            "beActivatedThisTurn": true,
            "tradeOneCard": false
        },
        "typeId": 4,
        "purchasePrice": 5,
        "incomeAmount": 3,
        "is": {
            "landmark": false
        },
        "activatedBy": {
            "diceTotal": [7],
            "typeIds": [1]
        },
        "takeFrom": {
            "playerWhoRolled": false,
            "allOtherPlayers": false,
            "anyOnePlayer": false,
            "bank": true
        },
        "allows": {
            "rollingTwoDice": false,
            "takingAnotherTurnIfDiceMatch": false,
            "choosingToRollAgain": false
        }
    },
    {
        "id": 10,
        "name": "furniture factory",
        "description": "if this is your turn get 3 coins from the bank for each natural resource establishment that you own",
        "maximumAllowedToHave": 99,
        "can": {
            "othersSee": true,
            "beActivatedAnyTurn": false,
            "beActivatedThisTurn": true,
            "tradeOneCard": false
        },
        "typeId": 4,
        "purchasePrice": 3,
        "incomeAmount": 3,
        "is": {
            "landmark": false
        },
        "activatedBy": {
            "diceTotal": [8],
            "typeIds": [5]
        },
        "takeFrom": {
            "playerWhoRolled": false,
            "allOtherPlayers": false,
            "anyOnePlayer": false,
            "bank": true
        },
        "allows": {
            "rollingTwoDice": false,
            "takingAnotherTurnIfDiceMatch": false,
            "choosingToRollAgain": false
        }
    },
    {
        "id": 11,
        "name": "mine",
        "description": "get 5 coins from the bank on anyones turn",
        "maximumAllowedToHave": 99,
        "can": {
            "othersSee": true,
            "beActivatedAnyTurn": true,
            "beActivatedThisTurn": false,
            "tradeOneCard": false
        },
        "typeId": 5,
        "purchasePrice": 6,
        "incomeAmount": 5,
        "is": {
            "landmark": false
        },
        "activatedBy": {
            "diceTotal": [9],
            "typeIds": []
        },
        "takeFrom": {
            "playerWhoRolled": false,
            "allOtherPlayers": false,
            "anyOnePlayer": false,
            "bank": true
        },
        "allows": {
            "rollingTwoDice": false,
            "takingAnotherTurnIfDiceMatch": false,
            "choosingToRollAgain": false
        }
    },
    {
        "id": 12,
        "name": "family restaurant",
        "description": "get 2 coins from the player who rolled the dice",
        "maximumAllowedToHave": 99,
        "can": {
            "othersSee": true,
            "beActivatedAnyTurn": true,
            "beActivatedThisTurn": false,
            "tradeOneCard": false
        },
        "typeId": 3,
        "purchasePrice": 3,
        "incomeAmount": 2,
        "is": {
            "landmark": false
        },
        "activatedBy": {
            "diceTotal": [9, 10],
            "typeIds": []
        },
        "takeFrom": {
            "playerWhoRolled": true,
            "allOtherPlayers": false,
            "anyOnePlayer": false,
            "bank": false
        },
        "allows": {
            "rollingTwoDice": false,
            "takingAnotherTurnIfDiceMatch": false,
            "choosingToRollAgain": false
        }
    },
    {
        "id": 13,
        "name": "apple orchard",
        "description": "get 3 coins from the bank on anyones turn",
        "maximumAllowedToHave": 99,
        "can": {
            "othersSee": true,
            "beActivatedAnyTurn": true,
            "beActivatedThisTurn": false,
            "tradeOneCard": false
        },
        "typeId": 0,
        "purchasePrice": 3,
        "incomeAmount": 3,
        "is": {
            "landmark": false
        },
        "activatedBy": {
            "diceTotal": [10],
            "typeIds": []
        },
        "takeFrom": {
            "playerWhoRolled": false,
            "allOtherPlayers": false,
            "anyOnePlayer": false,
            "bank": true
        },
        "allows": {
            "rollingTwoDice": false,
            "takingAnotherTurnIfDiceMatch": false,
            "choosingToRollAgain": false
        }
    },
    {
        "id": 14,
        "name": "fruit and vegetable market",
        "description": "if this is your turn get 2 coins from the bank for each crop establishment you own",
        "maximumAllowedToHave": 99,
        "can": {
            "othersSee": true,
            "beActivatedAnyTurn": false,
            "beActivatedThisTurn": true,
            "tradeOneCard": false
        },
        "typeId": 7,
        "purchasePrice": 2,
        "incomeAmount": 2,
        "is": {
            "landmark": false
        },
        "activatedBy": {
            "diceTotal": [11, 12],
            "typeIds": [0]
        },
        "takeFrom": {
            "playerWhoRolled": false,
            "allOtherPlayers": false,
            "anyOnePlayer": false,
            "bank": true
        },
        "allows": {
            "rollingTwoDice": false,
            "takingAnotherTurnIfDiceMatch": false,
            "choosingToRollAgain": false
        }
    },
    {
        "id": 90,
        "name": "station",
        "description": "roll 2 dice",
        "maximumAllowedToHave": 1,
        "can": {
            "othersSee": true,
            "beActivatedAnyTurn": true,
            "beActivatedThisTurn": true,
            "tradeOneCard": false
        },
        "typeId": 8,
        "purchasePrice": 4,
        "incomeAmount": 0,
        "is": {
            "landmark": true
        },
        "activatedBy": {
            "diceTotal": [0],
            "typeIds": []
        },
        "takeFrom": {
            "playerWhoRolled": false,
            "allOtherPlayers": false,
            "anyOnePlayer": false,
            "bank": false
        },
        "allows": {
            "rollingTwoDice": true,
            "takingAnotherTurnIfDiceMatch": false,
            "choosingToRollAgain": false
        }
    },
    {
        "id": 91,
        "name": "shopping mall",
        "description": "earn +1 coin from your drinks + food and staple food establishments",
        "maximumAllowedToHave": 1,
        "can": {
            "othersSee": true,
            "beActivatedAnyTurn": true,
            "beActivatedThisTurn": true,
            "tradeOneCard": false
        },
        "typeId": 8,
        "purchasePrice": 10,
        "incomeAmount": 0,
        "is": {
            "landmark": true
        },
        "activatedBy": {
            "diceTotal": [0],
            "typeIds": [2, 3]
        },
        "takeFrom": {
            "playerWhoRolled": false,
            "allOtherPlayers": false,
            "anyOnePlayer": false,
            "bank": false
        },
        "allows": {
            "rollingTwoDice": false,
            "takingAnotherTurnIfDiceMatch": false,
            "choosingToRollAgain": false
        }
    },
    {
        "id": 92,
        "name": "amusement park",
        "description": "if you roll matching dice take another turn after this one",
        "maximumAllowedToHave": 1,
        "can": {
            "othersSee": true,
            "beActivatedAnyTurn": true,
            "beActivatedThisTurn": true,
            "tradeOneCard": false
        },
        "typeId": 8,
        "purchasePrice": 16,
        "incomeAmount": 0,
        "is": {
            "landmark": true
        },
        "activatedBy": {
            "diceTotal": [0],
            "typeIds": []
        },
        "takeFrom": {
            "playerWhoRolled": false,
            "allOtherPlayers": false,
            "anyOnePlayer": false,
            "bank": false
        },
        "allows": {
            "rollingTwoDice": false,
            "takingAnotherTurnIfDiceMatch": true,
            "choosingToRollAgain": false
        }
    },
    {
        "id": 93,
        "name": "tv tower",
        "description": "once every turn you can choose to re-roll your dice",
        "maximumAllowedToHave": 1,
        "can": {
            "othersSee": true,
            "beActivatedAnyTurn": true,
            "beActivatedThisTurn": true,
            "tradeOneCard": false
        },
        "typeId": 8,
        "purchasePrice": 22,
        "incomeAmount": 0,
        "is": {
            "landmark": true
        },
        "activatedBy": {
            "diceTotal": [0],
            "typeIds": []
        },
        "takeFrom": {
            "playerWhoRolled": false,
            "allOtherPlayers": false,
            "anyOnePlayer": false,
            "bank": false
        },
        "allows": {
            "rollingTwoDice": false,
            "takingAnotherTurnIfDiceMatch": false,
            "choosingToRollAgain": true
        }
    }
];