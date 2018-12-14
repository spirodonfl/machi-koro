# What is this?

The php back-end of the machi koro board game

# API

/game
-- get status of (we'll actually get status from the json file, not from the api)
-- create new
-- join
/action
-- pass a game id
-- pass an action (string/id)

class game
-- grab json of game based on id (memory storage of recently active games?)
-- evaluate actions against game to determine if they're good actions
-- update state of game (into json file) after each turn is done (or other key game action)