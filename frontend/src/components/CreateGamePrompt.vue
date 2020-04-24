<template>
<div>
    <q-dialog v-model="showDialog">
      <q-card style="width: 300px" class="q-pa-md">
        <q-card-section>
          <div class="text-h5">Create Game</div>
        </q-card-section>
        <q-separator />
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >

        <div class="text-subtitle1">Game Name</div>
        <q-input
          outlined
          v-model="name"
          :rules="[val => !!val || 'Field is required',
                   val=> val.length>1 || 'Name too short']"
          label="Game name"/>
        
        <div class="text-subtitle1">Password (Optional)</div>
        <q-input 
            v-model="password"
            filled :type="isPwd ? 'password' : 'text'" 
        >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

        <div class="row justify-center">
          <q-btn label="Create" type="submit" color="primary"/>
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
  name: 'CreateGamePrompt',
  data () {
    return {
      name: '',
      password: '',
      isPwd: true
    }
  },
  props: {
    value: Boolean
  },
  computed: {
    showDialog: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
   onSubmit(e) {
      e.preventDefault();
      this.$socket.client.emit("create_game", {game_name: this.name, password: this.password}, (resp) => {
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
  created: function() {
  }
}
</script>
