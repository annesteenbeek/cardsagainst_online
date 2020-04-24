<template>
  <div>
    <q-layout view="hHr lpR fFf">

      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-btn style="transform: rotate(180deg)" 
            color="red"
            round icon="fas fa-sign-out-alt" 
            @click="leaveGame">
            <q-tooltip>
              Leave Game
            </q-tooltip>
          </q-btn>
          <q-toolbar-title style="text-align: center">
            {{ game_state_message }}
          </q-toolbar-title>

          <q-btn
           color="purple" 
           round 
           icon="chat" 
           class="q-ml-md" 
           @click="showChat = !showChat"
          >
            <q-badge 
              v-if="unseenMessages > 0" 
              color="red" 
              floating
            >
              {{ unseenMessages }}
            </q-badge>
          </q-btn>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="showChat"
        side="right"
        show-if-above
        bordered
        elevated
        :width="300"
        :breakpoint="500"
        content-class="bg-grey-3"
        @hide="onGutterClose"
      >
        <GameChat v-model="showChat"></GameChat>
      </q-drawer>

      <q-page-container>
        <!-- <router-view></router-view> -->
        <PlayersHeader></PlayersHeader>
        <template v-if="!started">
          <GameSettings></GameSettings>
        </template>
        <template v-else>
          <GameMatch transition-show="slide-up"></GameMatch>
        </template>
      </q-page-container>
    </q-layout>

  </div>
</template>

<script>
// import GameLobby from '@/components/GameLobby.vue';
import GameSettings from '@/components/GameSettings.vue';
import GameMatch from '@/components/GameMatch.vue';
import GameChat from '@/components/GameChat.vue';
import PlayersHeader from '@/components/PlayersHeader.vue';

export default {
  name: 'Game',
  components: {
    GameSettings,
    GameMatch,
    GameChat,
    PlayersHeader,
  },
  data () {
    return {
      showChat: false,
      prevSeenMessages: 0
    }
  },
  computed: {
    started () {
      return this.$store.state.game_state.started
    },
    unseenMessages() {
      if(this.showChat) {
        return 0
      } else {
        return this.$store.state.game_chat.length - this.prevSeenMessages;
      }
    },
    game_state_message() {
      const state = this.$store.state.game_state.match_state;
      let msg = "";
      if (state === "lobby") {
        msg = "Lobby";
      } else if (state === "players_selecting") {
        msg = "Players select card";
      } else if (state === "czar_selecting") {
        msg = "Czar is picking a winning card";
      }
      return msg 
    }
  },
  created () {
  },
  methods: {
   onGutterClose() {
      this.prevSeenMessages = this.$store.state.game_chat.length
    },
    leaveGame() {
      this.$socket.client.emit("leave_game");
      this.$router.push({name: "lobby"});
    }
  },
}
</script>
