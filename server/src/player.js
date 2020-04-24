'use strict';
const log = require('./logging')(__filename);
const EventEmitter = require('events');
const card_manager = require('./card_manager');
const c = require('./constants');
const sanitize = require('validator');

class Player extends EventEmitter {
    constructor(socket) {
        super()
        this.socket = socket;
        this.id = socket.id;
        this.in_game = ""; // id of current game
        this.name = "";
        this.reset_game_stats();

        this.socket.on(c.SET_NAME, (name, callback) => {
            // TODO: sanitize and check!
            if (this.name !== '') {
                callback({success: false, error: 'Name already set'})
            } else {
                name = sanitize.trim(name+'');
                if(name.length < 2) {
                    callback({success: false, error: 'Name too short'})
                } else {
                    this.name = name.slice(0, 15);
                    callback({success: true})
                    this.socket.emit(c.PLAYER_PROPS, this.get_props())
                }
            }
       })

    }

    disconnected() {
        // start timer to leave game?
        this.emit(c.PLAYER_EVENTS.DISCONNECT);
    }

    send_cards(){
        this.socket.emit(c.PLAYER_CARDS, card_manager.getWhite(this.cards));
    }

    reset_game_stats(){
        this.cards = [];
        this.start_ready = false;
        this.score = 0;
        this.state = c.PLAYER_STATES.IDLE
    }

    is_czar() {
        return this.state == c.PLAYER_STATES.CZAR_IDLE 
    }

    get_props() {
        return {
            name: this.name,
            id: this.id,
            score: this.score,
            state: this.state,
            start_ready: this.start_ready
        }
    }

}

module.exports = Player;