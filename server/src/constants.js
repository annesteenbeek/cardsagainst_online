module.exports = Object.freeze({
    SOCKET_PORT: 8000,
    DISCONNECT_TIMEOUT: 30000,

    PLAYER_EVENTS: {
        DISCONNECT: "disconnected"
    },
    GAME_EVENTS: {
        EMPTY: "empty",
        UPDATE: "UPDATE",
    },

    PLAYER_STATES: {
        IDLE: "idle",
        NO_PICK: "no_pick",
        PICKING: "picking",
        CZAR_IDLE: "czar_idle",
        CZAR_PICKING: "czar_picking",
    },
    GAME_STATES: {
        LOBBY: "lobby",
        PLAYERS_SELECTING: "players_selecting",
        CZAR_SELECTING: "czar_selecting"
    },

    // on
    CONNECTION: "connection",
    CREATE_GAME: "create_game",
    JOIN_GAME: "join_game",
    LEAVE_GAME: "leave_game",
    DISCONNECT: "disconnect",
    NEW_MESSAGE: "new_message", // player sent message to server
    START_GAME: "start_game",
    GET_GAME: "get_game",
    GET_STATE: "get_state",
    SET_NAME: "set_name",
    SET_READY: "set_ready",

    // emit
    DECKS: "decks", // emit all available decks
    GAMES: "games", // emit all current games
    PLAYER_PROPS: "player_props",
    NEW_PLAYER: "new_player", // new player joined game
    JOINED_GAME: "joined_game", // player joined the game
    LEFT_GAME: "left_game",
    CHAT_HISTORY: "chat_history",
    GAME_SETTINGS: "game_settings", // dict of settings of the game
    EMIT_MESSAGE: "emit_message", // message sent by player
    GAME_WINNER: "game_winner", 
    ROUND_WINNER: "round_winner",
    GAME_STATE: "game_state",
    BLACK_CARD: "black_card",
    REQUEST_CARDS: "request_cards", 
    PLAYED_CARDS: "played_cards",
    PLAYER_CARDS: "player_cards",
    CZAR_SELECT: "select_winner",
})