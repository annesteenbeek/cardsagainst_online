<template>
  <div id="app">
    <router-view></router-view>
    <dialogs-wrapper></dialogs-wrapper>
  </div>
</template>

<script>
export default {
  name: 'LayoutDefault',

  components: {
  },
  data () {
    return {
    }
  },
  computed: {
    error () {
      return this.$store.state.error
    }
  },
  watch: {
    error(newError, oldError) {
      if (newError !== "") {
        this.$q.notify({
          message: newError,
          type: 'negative',
          actions: [{
            label: 'DISMISS',
            color: 'yellow',
            handler: () => {
            }
          }]
        })
        this.$store.dispatch('dismiss_error')
      }
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');
@import url('https://cdn.jsdelivr.net/npm/animate.css@3.5.1');
body {
  font-family: 'Roboto', sans-serif;
}
</style>
