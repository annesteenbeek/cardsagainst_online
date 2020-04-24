<template>
  <div class="col q-pa-md q-gutter-md items-center">
    <div class="row justify-center q-gutter-xl q-pa-md">
      <div>
        <div>Win score</div>
        <q-input
          v-model.number="win_score"
          type="number"
          filled
          style="width: 60px"
        />
      </div>
      <div>
        <div>Round time (sec)</div>
        <q-input
          v-model.number="round_time"
          type="number"
          filled
          style="width: 60px"
        />
      </div>
    </div>

    <div class="row justify-center">
          <!-- :dense="$q.screen.xs" -->
      <q-table
          title="Packs"
          style="height: 400px; width:100%"
          dense
          virtual-scroll
          :pagination.sync="pagination"
          :rows-per-page-options="[0]"
          selection="multiple"
          :selected.sync="selected"
          :selected-rows-label="getSelectedString"
          :data="table.decks"
          :columns="table.columns"
          row-key="name"
        >
          <template v-slot:body-cell-icon="cellProperties">
            <q-td :props="cellProperties">
              <i :class="fa_class_string(cellProperties.value)" />
            </q-td>
          </template>
      </q-table>
    </div> 

    <!-- <div class="row justify-center">
      <q-btn color="primary" label="Start Game" @click="start_game"/>
    </div> -->
    <div class="row justify-center">
      <q-btn color="primary" label="Toggle Ready" @click="toggle_ready"/>
    </div>
 
  </div>
</template>

<style>
</style>

<script>
export default {
  name: 'GameSettings',
  data() {
    let decks = this.$store.state.decks;
    return {
      selection: [],
      pagination: {
        rowsPerPage: 0
      },
    }
  },
  methods: {
    start_game() {
      this.$socket.client.emit('start_game', (resp)=>{
        if (!resp.success) {
          this.$store.dispatch('error_banner', "Can't start game: " + resp.error);
        }
      })
    },
    toggle_ready() {
      this.$socket.client.emit('set_ready');
    },
    getSelectedString () {
      let nblack = 0;
      let nwhite = 0;
      this.selected.forEach(deck=>{
        nblack += deck.nblack;
        nwhite += deck.nwhite;
      })
      return this.selected.length === 0 ? '' : `${this.selected.length} deck${this.selected.length > 1 ? 's' : ''} selected, containing ${nwhite} white and ${nblack} black cards`
    },
    fa_class_string(fa_icon) {
      return 'fas fa-' + fa_icon
    }
  },
  computed: {
    ready_label() {
      return ""
    },
    round_time: {
      get() {
        return this.$store.state.game_settings.round_time;
      },
      set(round_time) {
        this.$socket.client.emit('game_settings', {round_time: round_time})
      }
    },
    win_score: {
      get() {
        return this.$store.state.game_settings.win_score;
      },
      set(win_score) {
        this.$socket.client.emit('game_settings', {win_score: win_score})
      }
    },
    selected: {
      get() {
        let decks = this.$store.state.decks;
        let selected = this.$store.state.game_settings.decks;
        return selected.map(key=>decks[key]);
      },
      set(new_selected) {
        // this.$store.dispatch('set_decks', new_selected.map(deck=>deck.key))
        this.$socket.client.emit('game_settings', {decks: new_selected.map(deck=>deck.key)})
      }
    },
    is_ready() {
      let my_id = this.$store.state.player.id;
      return this.$store.state.game_state.players.find(p=>p.id===my_id).start_ready
    },
    table() {
      let decks = this.$store.state.decks;
      return {
        columns: [
          {name: 'name', label: 'Deck title', field: 'name', align: 'left'},
          // {name: 'icon', label: 'Icon', field: 'icon'},
          {name: 'nblack', label: '#Black', field: 'nblack', align: 'left'},
          {name: 'nWhite', label: '#White', field: 'nwhite', align: 'left'},
        ],
        decks: decks['order'].map(key=>decks[key])
      }
    }, 
  },
}
</script>
