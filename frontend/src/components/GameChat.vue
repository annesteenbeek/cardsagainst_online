<template>
<div class="column no-wrap" style="height: 100%">
  <q-scroll-area class="fit" ref="chatScroll" >
    <div class="q-pa-md">
      <div v-for="(msg, index) in chat_messages" :key="index">
        <q-chat-message
          class="animated pulse"
          :name="is_sent(msg.id) ? 'You' : msg.name"
          text-sanitize
          name-sanitize
          :text="[msg.text]"
          :sent="is_sent(msg.id)"
        >
        </q-chat-message>
      </div>
    </div>
    <q-scroll-observer @scroll="on_scroll" />
  </q-scroll-area>
  <div >
    <q-separator class="q-m-sm" color="grey" inset />
    <q-input class="q-pa-sm" 
      v-model="chat_message" 
      rounded 
      outlined 
      autogrow
      placeholder="Chat message"
      @keyup.enter="send_message"
    >
      <template v-slot:after>
        <q-btn round dense color="primary" flat icon="send" @click="send_message"/>
      </template>
    </q-input>
  </div>
</div>

</template>

<style lang="scss">
</style>

<script>
export default {
  name: 'GameChat',
  props: {
  },
  data() {
    return {
      chat_message: "",
      last_scroll_direction: "down"
    }
  },
  computed: {
    chat_messages() {
      return this.$store.state.game_chat;
    }
  },
  methods: {
    is_sent(id) {
      return id === this.$store.state.player.id;
    },
    on_scroll(info) {
      this.last_scroll_direction = info.direction;
    },
    chat_to_bottom() {
      if (this.last_scroll_direction === "up") {
        return 
      }
      const scrollArea = this.$refs.chatScroll;
      const scrollTarget = scrollArea.getScrollTarget();
      const duration = 200; // ms
      scrollArea.setScrollPosition(scrollTarget.scrollHeight, duration);
    },
    send_message() {
      let msg = this.chat_message;
      if(msg !== "") {
        this.$socket.client.emit("new_message", msg);
        this.chat_message = ""
      }
    }
  },
  watch: {
    chat_messages(newChat, oldChat) {
      this.chat_to_bottom();
    }
  },
  created() {
    // setInterval(()=>{
    //   this.chat_message = "hello world"
    //   this.send_message()

    // },2000)
  }
}
</script>
