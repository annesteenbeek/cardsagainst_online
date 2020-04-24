import Vue from 'vue'
import Vuex from 'vuex'
import DOMPurify from 'dompurify';
import router from '@/router'
Vue.use(Vuex)

const getDefaultState = () => {
  return {
    decks: {},
    games: [],
    player: {name: "", id: ""},
    cards: [],
    active_game: "",
    connected: false,
    error: "",
    game_settings: {
        decks: [],
        round_time: 0,
        max_players: 0,
        nwildcards: 0,
        win_score: 0,
    },
    game_state: {
        started: false,
        match_state: "lobby",
        black_card: {},
        round: 0,
        players: []
    },
    game_chat: [],
    player_cards: [],
    played_cards: [],
  }
}


export default new Vuex.Store({
  state: getDefaultState(),
  mutations: {
      RESET(state) {
        Object.assign(state, getDefaultState())
      },
      DECKS(state, decks) {
        Vue.set(state, 'decks', decks);
      },
      GAMES(state, games) {
        Vue.set(state, 'games', games);
      },
      JOINED_GAME(state, game_id) {
        Vue.set(state, 'active_game', game_id);
      },
      LEFT_GAME(state) {
        Vue.set(state, 'active_game', "");
      },
      CONNECTED(state) {
        Vue.set(state,'connected', true);
      },
      DISCONNECT(state) {
        Vue.set(state,'connected', false);
      },
      PLAYER_NAME(state, name) {
          Vue.set(state.player, 'name', name)
      },
      PLAYER_ID(state, id) {
          Vue.set(state.player, 'id', id);
      },
      SHOW_ERROR(state, error) {
          Vue.set(state, 'error', error);
      },
      DISMISS_ERROR(state) {
          Vue.set(state, 'error', "");
      },
      GAME_SETTINGS(state, settings) {
          Vue.set(state, 'game_settings', settings);
      },
      GAME_DECKS(state, decks) {
          Vue.set(state.game_settings, 'decks', decks);
      },
      PLAYER_CARDS(state, cards) {
          Vue.set(state, 'cards', cards);
      },
      GAME_STATE(state, game_state) {
          Vue.set(state, 'game_state', game_state);
      },
      CHAT_HISTORY(state, chat_history) {
        Vue.set(state, 'game_chat', chat_history);
      },
      NEW_MESSAGE(state, message) {
        Vue.set(state, 'game_chat', [...state.game_chat, message])
      },
      PLAYED_CARDS(state, played_cards) {
        Vue.set(state, 'played_cards', played_cards)
      },
  },
  actions: {
      socket_decks({dispatch, commit}, decks) {
        commit('DECKS', decks);
      },
      socket_games({dispatch, commit}, games){
        games.forEach(game => {
          game.name = DOMPurify.sanitize(game.name);
        })
        commit('GAMES', games);
      },
      socket_joinedGame({dispatch, commit}, game_id){
        commit('JOINED_GAME', game_id);
        // TODO: if not already on page
        // router.push({name: "game", params: {game_id: game_id}});
      },
      socket_leftGame({dispatch, commit}){
        commit('LEFT_GAME');
      },
      socket_connect({dispatch, commit}, data) {
        // make sure initial data is set before starting
        this._vm.$socket.client.emit('get_state', (resp) => {
            commit('GAMES', resp.games);
        })
        commit('CONNECTED');
      },
      socket_disconnect({dispatch, commit}, reason) {
        console.log("Disconnected: " + reason);
        router.push({name: "lobby"});
        commit('RESET') // reset store
        commit('DISCONNECT')
      },
      socket_playerProps({dispatch, commit}, data) {
 
        commit('PLAYER_NAME', DOMPurify.sanitize(data.name));
        commit('PLAYER_ID', data.id)
      },
      error_banner({dispatch, commit}, error) {
        commit('SHOW_ERROR', error);
        setTimeout(()=> {
            dispatch("dismiss_error")
        }, 5000);
      },
      dismiss_error({dispatch, commit}) {
        commit('DISMISS_ERROR')
      },
      socket_gameSettings({dispatch, commit}, settings){
        commit('GAME_SETTINGS', settings);
      },
      socket_gameState({dispatch, commit}, game_state) {
        commit('GAME_STATE', game_state);
      },
      socket_playedCards({dispatch, commit}, played_cards) {
        commit('PLAYED_CARDS', played_cards);
      },
      set_decks({dispatch, commit}, new_decks) {
        let new_settings = {...this.state.game_settings, decks: new_decks};
        this._vm.$socket.client.emit('game_settings', new_settings)
        commit('GAME_SETTINGS', new_settings);  
      },
      socket_playerCards({dispatch, commit}, cards) {
        commit('PLAYER_CARDS', cards);
      },
      socket_chatHistory({dispatch, commit}, chat_history) {
        chat_history.forEach(msg => {
          msg.text = DOMPurify.sanitize(msg.text);
        })
        commit('CHAT_HISTORY', chat_history);
      },
      socket_emitMessage({dispatch, commit}, message) {
        commit('NEW_MESSAGE', DOMPurify.sanitize(message));
      },
  }
})