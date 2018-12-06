# What is this?

An online or couch co-op version (digital) of the Machi Koro board game.

## Goals
* Cross browser friendly (include IE11)
* Cross platform friendly (couch co-op particularly)
* As leading edge in terms of programming language and techiques as possible
* No frameworks or libraries (aside from what's default in a given language)
* A good design / UX (if anybody out there would like to contribute to design or UX please reach out)
* At least capable of 2 players

## Technology decisions / thoughts
* WebComponents
* Vanilla JS (Typescript)
NOTE: TYPESCRIPT HAS A SERIOUS ISSUE WITH EXTENDING HTMLELEMENTS WHEN USING WEBCOMPONENTS W/ THE CONSTRUCTOR SUPER CALL
BABEL + ESLINT ARE PROBABLY BETTER FOR RAW METAL
* Polyfills only when necessary
* Atomized (atomic) CSS (tailwind)
* Online - PHP
* Couch co-op - Node (QT GUI)
* Cover Android & iOS by implement a PWA
* WebRTC - Might allow for pure mobile to mobile multiplayer with no server
* Finite state machines
* MySQL / PHP for authentication on online service(?)
* (down the road): general performance considerations
NOTE: SHOULD ADD UNIT TESTING

## Potential adaptations
* JSON file may just be initial game state + action / audit log
* (?) Re-join a game, you get latest snapshot + latest actions? ....

## MVP
* PHP - will serve API requests with success or fail
* PHP - will also generate a JSON file (one per game) with the current state of the game
* PHP - JSON file - Uniquely named for the game being played
* Above allows for unlimited(?) requests without siteground restrictions
* Client (player) will make user action requests against PHP API
* Client (player) will continuously ask for game state by requesting specific JSON file
* JSON file may include full game state in all its glory, all history, all data, everything
* Basic UI (to take actions and see states / results)
* No authentication - just two player defaults
