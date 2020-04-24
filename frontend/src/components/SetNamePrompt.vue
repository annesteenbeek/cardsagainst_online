<template>
<div>
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 300px" class="q-pa-md">
        <q-card-section>
          <div class="text-h5">Player Name</div>
        </q-card-section>
        <q-separator />
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >
        <q-input
          outlined
          v-model="name"
          :rules="[val => !!val || 'Field is required',
                   val => val.length > 1 || 'Name too short']"
          label="Player Name"/>
        
        <div class="row justify-center">
          <q-btn label="Submit" type="submit" color="primary"/>
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
  name: 'SetNamePrompt',
  data () {
    return {
      showDialog: true,
      name: '',
    }
  },
  props: {
    value: Boolean
  },
  computed: {
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.$socket.client.emit("set_name", this.name, (resp) => {
        if (resp.success) {
          console.log("Name succesfully set")
          this.$close();
        } else{
          console.log("unable to set name: " + resp.error)
          this.$store.dispatch('error_banner', resp.error)
        }
      })
    },
  },
  created: function() {
  }
}
</script>
