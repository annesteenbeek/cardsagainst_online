<template>
  <div class="player_row row q-gutter-md justify-center shadow-2">
    <div class="player_col shadow-6 col col-3" v-for="player in players" :key="player.id">
      <q-badge v-if="isPlayer(player.id)" color="orange" floating>You</q-badge>
      <div class="row">
        <div class="col-9">
          <div class="player_name"> 
              {{ player.name }}
          </div>
          <div v-if="game_state!=='lobby'" class="text-caption"> Score: {{ player.score }} </div>
          <div v-if="game_state==='lobby'" class="text-caption desktop-only">
            {{ player.start_ready ? 'Ready to start' : 'Waiting for player'}}
          </div>
        </div>
        <div v-if="game_state !== 'lobby'" class="col-3 player_state">
          <q-spinner-gears
            v-if="player.state === 'picking' || player.state === 'czar_picking'"
            class="absolute-center"
            color="black"
            size="1.5em"
          />
          <q-icon v-if="player.state ==='czar_idle'"
            name="fas fa-crown" size="1.5em" color="black" class="absolute-center" />
          <q-icon v-if="player.state ==='idle'"
            name="fas fa-check" size="1.5em" color="black" class="absolute-center" />
          <q-icon  v-if="player.state === 'no_pick'"
            name="fas fa-times" size="1.5em" color="black" class="absolute-center" />
        </div>
        <div v-if="game_state === 'lobby'" class="col-3 player_state">
          <q-icon v-if="player.start_ready"
            name="fas fa-check" size="2em" color="green" class="absolute-center" />
          <q-icon  v-if="!player.start_ready"
            name="fas fa-times" size="2em" color="red" class="absolute-center" />
        </div>
      </div>
    </div>

  </div>
</template>

<style lang="scss">

  .player_row {
    padding: 10px;
    background-color: #c7c7c7;
  }

  .player_state {
    position: relative;
  }

  .player_name {
    font-size: 16px;
    font-weight: 300;
    white-space: nowrap;
    overflow: hidden;

  }

  .player_col {
    background-color: white;
    position: relative;
    padding: 5px;
    border-radius: 4px;
  }

</style>

<script>

export default {
  name: 'PlayersHeader',
  components: {
  },
  props: {
  },
  computed: {
    players() {
      return this.$store.state.game_state.players;
    },
    game_state() {
      return this.$store.state.game_state.match_state;
    },
    started() {
      return this.$store.state.game_state.started;
    }
  },
  methods: {
    clicked() {
      if(this.clickable){
        this.$emit('clicked')
      }
    },
    isPlayer(id) {
      return id === this.$store.state.player.id;
    }

  }
}
</script>
