'use strict'

var expect = require('chai').expect
const index = require('../src/index');
const Game = require('../src/game');
const Player = require('../src/player');
const io = require('socket.io-client');
const card_manager = require('../src/card_manager');
const c = require("../src/constants");


const ioOptions = { 
      transports: ['websocket']
    , forceNew: true
    , reconnection: false
  }
var client1;
var client2;


describe('Player tests', function(){
  this.timeout(1000);
  before(function(done){
    
    // start the io server
    // server.start()
    // connect two io clients
    // sender = io('http://localhost:3000/', ioOptions)
    client1 = io.connect('http://localhost:8000/', ioOptions)
    client2 = io.connect('http://localhost:8000/', ioOptions)
    
    // finish beforeEach setup
    done()
  })

  after(function(done){
    
    // disconnect io clients after each test
    // sender.disconnect()
    // client1.disconnect()
    // client2.disconnect()
    index.server.close();
    done()
  })

  // after(function(){
  //   index.server.close();
  // })

  describe('initialization', function(){
    it('decks', function(done){
      client1.on(c.DECKS, function(msg){
        done()
      })
    })

    // it('games', function(done){
    //   client1.on(c.GAMES, function(games){
    //     expect(games.length).to.equal(0)
    //     done()
    //   })
    })


  describe('game', function(){

    it("create game", function(done){
      expect(index.game_map.size).to.equal(0)
      client1.emit(c.CREATE_GAME, {game_name: "test", password: ""})
      setTimeout(()=>{
        expect(index.game_map.size).to.equal(1)
        done()
      },100)
    })

    // it("empty game", function(done){
    //   let test_game = new Game(index.server, "test_game", "");
    //   test_game.join(client1);
    //   expect(test_game.players.length).to.equal(1)
    //   test_game.destructor = () => {
    //     done();
    //   }
    //   test_game.remove(client1);
    // })

  })

  describe('game_round', function(){
    var test_game;
    var player1, player2;

    before(function(){
      test_game = new Game(index.server, "test_game", "");
      expect(index.clients.size).to.equal(2)
      let clients = index.clients.entries();
      player1 = clients.next().value[1];
      player2 = clients.next().value[1];
      test_game.join(player1);
      test_game.join(player2);
    })

    // it("joined game", function(done){
    //   client1.on(c.JOINED_GAME, (game_id)=>{
    //     expect(test_game.game_id).to.equal(game_id)
    //     done()
    //   })
    // })

    it("players in game", function(done){
      expect(test_game.players.length).to.equal(2);
      done();
    })

    it("round", function(done){
      test_game.play_round();
      done()

    })



  })

})


