<template>
  <div>
    <div v-resize-text class="text-h2">
      Cards against humanity Online
    </div>
    <div class="q-pa-md">
        <q-table
          title="Available games"
          :data="table.data"
          :columns="table.columns"
          row-key="name"
          :filter="table.filter"
          virtual-scroll
          dense
          no-data-label="No games available yet, create one!"
          style="height: 100%"
        >
        <template v-slot:top>
          <q-btn color="primary" icon="far fa-plus-square" label="New Game" @click="showCreatePrompt = true" />
          <q-space />
       </template>


        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn dense round flat color="green" @click="joinGame(props.row.game_id)" icon="fas fa-play"/>
          </q-td>          
        </template> 
      </q-table>
    </div>
    <CreateGamePrompt v-model="showCreatePrompt" />
  </div>
</template>

<style>
</style>

<script>

import CreateGamePrompt from '@/components/CreateGamePrompt.vue';

export default {
  name: 'MainLobby',
  components: {
    CreateGamePrompt
  },
  data() {
    return {
      showCreatePrompt: false
    }
  },
  methods: {
    createGame() {
      this.$socket.client.emit("create_game", {game_name: "test", password:""}, (resp) => {
        if (resp.success) {
          console.log("Game succesfully created")
          this.joinGame(resp.game_id)
        } else{
          console.log("unable to create game: " + resp.error)
          this.$store.dispatch('error_banner', resp.error)
        }
      })
    },
    joinGame(game_id) {
     this.$router.push({name: "game", params: {game_id: game_id}});
    }
  },
  computed:{
    games() {
      return this.$store.state.games
    },
    active_game() {
      return this.$store.state.active_game
    },
    table() {
      // TODO duplicate keys smae game name
      return {
        filter: '',
        columns: [
          {
            name: 'game_name',
            required: true,
            label: 'Game name',
            align: 'left',
            field: 'game_name',
            format: val=> `${val}`,
            sortable: true
          },
          { name: 'players', label: 'Players', field: 'players' },
          { name: 'password', label: 'Password Protected', field: 'has_password' },
          { name: 'actions', label: 'Join', field: '', align:'center' },
        ],
        data: this.$store.state.games
      }
    }
  },
}
</script>
