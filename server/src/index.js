"use strict";
const log = require('./logging')(__filename);
const express = require('express');
const app = express();
const http = require('http').createServer(app)
const server = require('socket.io')(http);

log.info("Server started")
log.info("Environment set to: " + process.env.NODE_ENV)

const card_manager = require('./card_manager');
const Player = require('./player');
const Game = require('./game');
const c = require('./constants');

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static("/home/anne/src/cardsagainst_online/frontend/dist/"))
}

http.listen(c.SOCKET_PORT);


var clients = new Map();
var games = new Map();

function get_games() {
    return Array.from(games.values(), game => game.get_public_props())
}

function publish_games(target){
    target.emit(c.GAMES, get_games());
}

server.on(c.CONNECTION, (socket) => {
    log.info(`Client connected [id=${socket.id}]`);
    const player = new Player(socket);
    clients.set(socket, player);

    socket.emit(c.DECKS, card_manager.decks);
    socket.emit(c.PLAYER_PROPS, player.get_props())
    if(player.in_game !== "") {
        // TODO: reconnect?
        // socket.emit(c.JOINED_GAME)
        log.error("New player already in game")
    }
    // publish_games(socket);

    socket.on(c.GET_STATE, (callback) => {
        callback({games: get_games()})
    })


    socket.on(c.CREATE_GAME, (data, callback) => {
        if(clients.get(socket).in_game == "") {
            log.info("creating new game");

            let game = new Game(server,
                            data.game_name,
                            data.password
                            );

            games.set(game.game_id, game);
            game.on(c.GAME_EVENTS.UPDATE, () => {
                publish_games(server); // only emit game change for this game
            })
            game.on(c.GAME_EVENTS.EMPTY, ()=>{
                games.delete(game.game_id);
                publish_games(server); // only emit game change for this game
                log.info(`Game ${game.game_id} has been removed`);
            })
            game.join(player);
            publish_games(server);
            callback({success: true, game_id: game.game_id});
        } else {
            log.info("Player already in game: " + clients.get(socket).in_game);
            callback({success: false, error: "You are still in another game, leave first."});
        }

    })

    socket.on(c.JOIN_GAME, (data, callback) => {
        let game = games.get(data.game_id);
        let player = clients.get(socket);

        if (typeof game === 'undefined') {
            log.error("Tried to access nonexistent game: " + data.game_id);
            callback({success: false, error: "Game does not exist"});
        } else if (game.players.has(player)) {
            log.info("Player was already in game")
            callback({success: true});
        } else if (player.in_game !== "") {
            log.error("player tried to join game while already in another game")
            callback({success: false, error: "Already in game"});
        } else if (game.password === data.password) {
           game.join(player); 
           callback({success: true});
        } else {
            callback({success: false, error: "incorrect password"});
        }
    })

    socket.on(c.DISCONNECT, () => {
        clients.get(socket).disconnected();
        clients.delete(socket);
        
        log.info(`Client disconnected [id=${socket.id}]`);
    });
});

module.exports.server = server;
module.exports.games = games;
module.exports.clients = clients;