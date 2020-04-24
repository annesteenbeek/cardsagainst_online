"use strict";
const log          = require('./logging')(__filename);
const EventEmitter = require('events');
const card_manager = require('./card_manager');
const utils        = require('./utils');
const c            = require('./constants');
const sanitize     = require('validator');

class Game extends EventEmitter {
    constructor(server, game_name, password) {
        super()
        this.password  = password;
        this.game_name = game_name;

        // default game settings
        this.nwildcards  = 0;
        this.max_players = 10;
        this.win_score   = 10;
        this.round_time  = 10;
        this.decks       = [card_manager.decks.order[0]]; // list of abbreviations

        this.players     = new Set();     // game host could be index 0
        this.chat        = [];
        this.white_cards = [];
        this.black_cards = [];

        this.started     = false;
        this.game_state  = c.GAME_STATES.LOBBY;
        this.black_card  = {};
        this.round       = 0;

        this.game_id = utils.generate_id();
        this.room    = server.sockets.to(this.game_id);

        this.game_settings = {
            nwildcards: this.nwildcards,
            max_players: this.max_players,
            win_score: this.win_score,
            round_time: this.round_time,
            decks: this.decks
        }

    }

    // TODO: event emitter for public prop change?
    get_public_props() {
        return {
            game_id  : this.game_id,
            game_name: this.game_name,
            players  : this.players.size,
            started  : this.started,
            has_password: this.password !== "",
            max_players : this.max_players,
        }
    }

    updated() {
        this.emit(c.GAME_EVENTS.UPDATE);
    }


    join(player) {
        // TODO: ask for name first, or set name beforehand in lobby?

        player.in_game = this.game_id;
        this.players.add(player);
        this.updated();
        player.socket.join(this.game_id);

        player.socket.emit(c.JOINED_GAME, this.game_id);
        player.socket.emit(c.CHAT_HISTORY, this.chat);
        player.socket.emit(c.GAME_SETTINGS, this.game_settings);
        this.emit_game_state();

        player.socket.on(c.LEAVE_GAME, (data) => {
            this.remove(player, "player left");
        })

        player.socket.on(c.START_GAME, (callback)=> {
            // TODO: check if player is host
            if (this.players.size > 1) {
                if (!this.started) {
                    callback({success: true});
                    // this.play_round()
                } else {
                    callback({success: false, error: "Game is already running"})
                }
            } else {
                callback({success: false, error: "Not enough players in game"});
            }
            this.round_promise = this.play_round()
        })

        player.socket.on(c.GAME_SETTINGS, (new_settings) => {
            for (let [key, value] of Object.entries(new_settings)) {
                console.log("key: " +key +" value: " + value)
                if(key === 'win_score') {
                    if (value > 0 && value < 99) {
                        this.game_settings[key] = value;
                    } 
                } else if (key === 'round_time') {
                    if (value > 5 && value < 60) {
                        this.game_settings[key] = value;
                    }
                } else if (key === 'decks') {
                    this.game_settings[key] = value
                }
            }
            this.room.emit(c.GAME_SETTINGS, this.game_settings);
        })

        player.socket.on(c.NEW_MESSAGE, (text) => {
            text = text + '';
            text = sanitize.trim(text);
            if (text.length < 1) {
                return
            }

            let msg = {
                    time   : new Date().getTime(),
                    id: player.id,
                    name: player.name,
                    text: text 
                }
            this.room.emit(c.EMIT_MESSAGE, msg);
            this.chat.push(msg);
        })

        player.socket.on(c.SET_READY, () => {
            player.start_ready = !player.start_ready;

            let should_start = true;
            this.players.forEach(p=>{
               if (!p.start_ready)  {
                   should_start = false
               }
            })
            if (should_start && this.players.size>1) {
                this.play_round();
            }
            this.emit_game_state();
        })

        player.on(c.PLAYER_EVENTS.DISCONNECT, ()=>{
            this.remove(player, "Disconnected");
        })
    }

    remove(player, reason="") {
        if (this.players.delete(player)) {
            player.in_game = "";
            player.socket.leave(this.game_id); // remove from room
            player.socket.emit(c.LEFT_GAME); // notify player that he has been removed
            this.emit_game_state();
            this.updated();
            log.info(`Removed player ${player.socket.id}, reason: ${reason}`);

            // if no more players in the game, destroy the game using the callback function
            if (this.players.size == 1) {
                this.started = false;
            }
            if (this.players.size == 0) {
                this.started = false;
                this.emit(c.GAME_EVENTS.EMPTY);
            }
        } else {
            log.error("Unable to remove player");
        }
    }

    is_game_over() {
        // TODO: no more black cards
        if (!this.started) {
            this.game_state = c.GAME_STATES.LOBBY;
            this.emit_game_state()
            return true 
        }
        this.players.forEach((player) => {
            if (player.score >= this.win_score){
                this.room.emit(c.GAME_WINNER, player.name);
                this.game_state = c.GAME_STATES.LOBBY;
                this.emit_game_state()
                log.info("Match ended, winner: " + player.name);
                return true
            }
        })
        return false
    }

    emit_game_state() {
        this.room.emit(c.GAME_STATE, {
            started: this.started,
            match_state: this.game_state,
            black_card: this.black_card,
            round: this.round,
            players: [...this.players].map(player => player.get_props())
       })
    }

    async play_round() {

        this.started = true;
        this.updated();


        let cards    = card_manager.getCards(this.decks);
        var white_it = cards['white'][Symbol.iterator]();
        var black_it = cards['black'][Symbol.iterator]();

        const czar_iterator = utils.circularIterator(this.players);

        this.players.forEach((player) => {
            player.reset_game_stats();

            // draw 10 white cards
            for(var i = 0; i < 10; i++) {
                player.cards.push(white_it.next().value);
            }
            player.send_cards();

        })

        this.round = 0;
        while (!this.is_game_over()) {
            this.round++;
            let czar = czar_iterator.next().value;
            czar.state = c.PLAYER_STATES.CZAR_IDLE;
            this.game_state = c.GAME_STATES.PLAYERS_SELECTING;

            this.black_card = card_manager.getBlack(black_it.next().value)
            this.emit_game_state();

            let card_promises = [];
            let played_cards  = [];
            this.players.forEach(player => {
                if (!player.is_czar()) {
                    card_promises.push(new Promise((resolve)=>{
                        let wait = setTimeout(() => {
                            player.state = c.PLAYER_STATES.NO_PICK; // or too late
                            this.emit_game_state(); // broadcast that player is done
                            resolve()
                        }, this.round_time*1000);
                        player.state = c.PLAYER_STATES.PICKING;

                        player.socket.emit(c.REQUEST_CARDS, (hand_index) => {
                            if (!Array.isArray(hand_index)) {
                                hand_index = [hand_index];
                            }
                            if (hand_index.length == this.black_card.pick && 
                                Math.min.apply(Math, hand_index) >= 0 &&
                                Math.max.apply(Math, hand_index) < player.cards.length){
                                clearTimeout(wait)
                                player.state = c.PLAYER_STATES.IDLE;
                                this.emit_game_state(); // broadcast that player is done

                                const cards = hand_index.map(i => player.cards[i])
                                // remove cards from hand
                                hand_index.forEach(i => player.cards.splice(i, 1))
                                played_cards.push([player, cards])
                                resolve()
                            } 
                        })
                    }))
                }
            })

            this.emit_game_state();
            await Promise.all(card_promises).then((values) => {
                // publish played cards
                czar.state = c.PLAYER_STATES.CZAR_PICKING;
                this.game_state = c.GAME_STATES.CZAR_SELECTING;
                utils.shuffle(played_cards)
                this.room.emit(c.PLAYED_CARDS, played_cards.map(p=>{
                    return card_manager.getWhite(p[1])
                }));
                this.emit_game_state();
            }).catch((error) => {
                log.error(error);
            })


            // TODO: if nobody selected any cards, game over as well

            let czar_promise = new Promise((resolve, reject) => {
                let wait = setTimeout(() => {
                    reject("Czar didnt respond in time.");
                }, this.round_time*1000);

                czar.socket.emit(c.CZAR_SELECT, (win_index) => {
                    if (win_index >= 0 && win_index < played_cards.length) {
                        clearTimeout(wait);
                        resolve(win_index);
                    } else {
                        console.log(win_index)
                        reject("Received incorrect winner index")
                    }
                })
            });


            await czar_promise.then((win_index) => {
                let winner = played_cards[win_index][0]
                winner.score++
                this.room.emit(c.ROUND_WINNER, winner.id);
            }).catch((error)=>{
                log.error(error);
            })

            // new cards are drawn
            played_cards.forEach(pair => {
                // TODO: determine how many cards can be drawn from black card
                let player = pair[0];
                for(var i = 0; i < this.black_card.pick; i++) {
                    player.cards.push(white_it.next().value);
                }
                player.send_cards();
            })
        }

        this.started = false
        this.updated();
        return 
    }


}

module.exports = Game;