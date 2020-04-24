<template>
  <div>
    <q-dialog v-model="showDialog" @hide="onHide">
      <q-card style="width: 300px" class="q-px-sm q-pb-md">
        <q-card-section>
          <div class="text-h6">Join Game</div>
        </q-card-section>
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >
       <q-input 
          v-model="password"
          filled :type="isPwd ? 'password' : 'text'" 
          hint="Game password"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
          error-message="Incorrect Password"
          :error="!isCorrectPassword"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <div>
          <q-btn label="Join" type="submit" color="primary"/>
        </div>
      </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<style>
</style>

<script>
export default {
  name: 'JoinGamePrompt',
  data () {
    return {
      showDialog: false,
      name: '',
      password: '',
      isPwd: true,
      isCorrectPassword: true,
    }
  },
  props: {

  },
  methods: {
    onHide(){
      // this.$error("Cancelled login")
      console.log("Hid login dialog")
    },
    onSubmit(e) {
      e.preventDefault();
      let route_game_id = this.$props.route_game_id;
      let password = this.$data.password;
      this.$socket.client.emit("join_game", {game_id: route_game_id, password: password}, (resp) => {
        console.log(resp)
        if (resp.success) {
          console.log("Successfully joined game")
          this.$close();
        } else {
          if(resp.error === "incorrect password"){
            this.$data.isCorrectPassword = false;  
            this.$data.password = ''
          } else {
            console.log("unable to join game: " + resp.error);
            this.$error(resp.error);
          }
        }
      })
    },
    joinGame() {
      let route_game_id = this.$props.route_game_id;
      console.log("joinging game: " + route_game_id);
      this.$socket.client.emit("join_game", {game_id: route_game_id, password: ""}, (resp) => {
        if(resp.success){
          this.$close();
        } else {
          this.$error(resp.error);
        }
      })
    }
  },
  created: function() {
    let route_game_id = this.$props.route_game_id;
    let active_game_id = this.$store.state.active_game;
    let player_name = this.$store.state.player.name; 
    let target_game = this.$store.state.games.find(game => game.game_id == route_game_id);

    if (typeof target_game === 'undefined') {
      this.$error("Game not found")
      return
    }

    if (active_game_id === "") {
      // no game joined yet, continue
      if (player_name === "") {
        console.log("player name still unknown")
        this.$props.ask_name = true;
      }
      if(!target_game.has_password) {
        // game does not require password, continue
        this.joinGame();
      }
    } else if (active_game_id === route_game_id) {
      // already joined game, continue
      this.$close();
    } else {
      // joined wrong game, ask to leave game first
      // TODO:
      this.$error("Already active in different game, leave first")
      return
    }
    this.$data.showDialog = true;
  }
}
</script>
