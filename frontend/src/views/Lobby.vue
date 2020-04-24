<template>
  <div class="home">
    <MainLobby/>
  </div>
</template>

<script>
// @ is an alias to /src
import MainLobby from '@/components/MainLobby.vue'

export default {
  name: 'Lobby',
  components: {
    MainLobby
  }
}
</script>
