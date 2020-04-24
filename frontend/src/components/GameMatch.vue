<template>
  <div>
  <q-linear-progress size="10px" :value="round_progress" />
   <div class="q-pa-md row items-start result_row">
      <!-- <transition appear enter-active-class="animated slideInLeft" -->
    <!-- leave-active-class="animated slideOutRight" :duration="1000"> -->
      <GameCard
        v-bind:black="true"
        :key="black_card.text"
        v-bind:text="black_card.text"
        v-bind:pick="black_card.pick"
      />
      <!-- </transition> -->

      <div class="column q-pa-md">
        <q-btn color="white" 
          v-if="this_player.state === 'picking'"
          text-color="black" 
          label="CONFIRM" 
          :disable="!can_confirm" 
          @click="confirm_selection" />

        <q-btn 
          v-if="this_player.state === 'czar_picking'"
          color="black" 
          text-color="white" 
          label="CZAR CONFIRM" 
          :disable="!can_czar_confirm" 
          @click="czar_confirm" />
      </div>

      <div v-if="match_state === 'czar_selecting' && !$q.platform.is.mobile" class="q-pa-md row justify-start q-gutter-md">
        <div v-for="(cards, index) in played_cards" :key="index">
          <div v-for="(text, j) in cards" :key="j">
            <GameCard 
              v-bind:text="text"
              :clickable="can_czar_select"
              :selected="czar_selected === index"
              @clicked="czar_selected = index"
            />
          </div>
        </div>
     </div>

     <div>
      
     </div>
  
      <!-- <div v-for="index in 0" :key="index">
        <div class="card_child column">
          <GameCard 
            text="This is a verry long test card text nothing to say"
            :clickable="can_czar_select"
            :selected="czar_selected === index-1"
            @clicked="czar_selected = index-1"
          >
          <GameCard 
            text="BOTTOM This is a verry long test card text nothing to say"
          >
          <GameCard 
            text="BOTTOM This is a verry long test card text nothing to say"
          />
          </GameCard>
          </GameCard>
        </div>
      </div> -->


    </div>

    <!-- Mobile -->
      <div v-if="$q.platform.is.mobile">
        <q-scroll-area
            horizontal
            style="height: 200px; width: 100%"
          >
          
        <div class="row no-wrap q-pa-md q-gutter-md">

        <template v-if="match_state === 'czar_selecting'">
          <div v-for="(cards, index) in played_cards" :key="index">
            <div v-for="(text, j) in cards" :key="j">
              <GameCard 
                v-bind:text="text"
                :clickable="can_czar_select"
                :selected="czar_selected === index"
                @clicked="czar_selected = index"
              />
            </div>
          </div>
        </template>
  
        <template v-else>
          <GameCard 
            v-for="(text, index) in hand_cards"
            v-bind:text="text"
            v-bind:clickable="clickable(index)"
            v-bind:selected="is_selected(index)"
            v-bind:key="text"
            @clicked="click_card(index)"
          />
        </template>
        </div>


      </q-scroll-area>
    </div>

    <!-- not mobile -->
    <div v-if="!$q.platform.is.mobile">
     <div class="row q-pa-md q-gutter-md">
       <GameCard 
          v-for="(text, index) in hand_cards"
          v-bind:text="text"
          v-bind:clickable="clickable(index)"
          v-bind:selected="is_selected(index)"
          v-bind:key="text"
          @clicked="click_card(index)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .result_row{
    height: 250px;
  }

  .card_child{
    height: 0px;
    transform: scale(0.6); // determine correct scale
  }
</style>

<script>
import GameCard from '@/components/GameCard.vue';

export default {
  name: 'GameMatch',
  components: {
    GameCard,
  },
  data() {
    return {
      selected_cards: [],
      czar_selected: undefined,
      round_progress: 0.0,
      progress_interval: undefined,
      card_confirm_callback: undefined,
      czar_select_callback: undefined,
   }
  },
  methods: {
    is_selected(card_index) {
      const index = this.selected_cards.indexOf(card_index)
      return index > -1
    },
    clickable(card_index) {
      if (this.can_select) { // time to select?
        const to_pick = this.black_card.pick
        if (this.is_selected(card_index)){ // already selected
          return true
        } else if (this.selected_cards.length < to_pick) { // room to pick more
          return true
        }
      } 
      return false
    },
    click_card(clicked_index) {
      const index = this.selected_cards.indexOf(clicked_index)
      if (index > -1) { // already selected?
        this.$delete(this.selected_cards, index)
      } else {
        this.selected_cards = [...this.selected_cards, clicked_index]
      }
    },
    confirm_selection() {
      this.card_confirm_callback(this.selected_cards);
      this.card_confirm_callback = undefined;
    },
    czar_confirm() {
      const index = this.czar_selected;
      console.log("czar selected index: " + index)
      this.czar_select_callback(index)
      this.czar_select_callback = undefined;
    },
    start_interval() {
      if (typeof this.progress_interval !== "undefined") {
        clearInterval(this.progress_interval)
        this.round_progress = 0;
      }

      const interval = 1000;
      this.progress_interval = setInterval(()=> {
        this.round_progress = this.round_progress + 1/(this.round_time/interval)
        if (this.round_progress >= 1) {
          this.round_progress = 0;
          clearInterval(this.progress_interval);
        }
      }, interval);
    }
  },
  computed: {
    can_confirm() {
      return this.selected_cards.length == this.black_card.pick &&
              this.match_state === "players_selecting" &&
              typeof this.card_confirm_callback !== "undefined"
    },
    can_czar_confirm() {
      return this.this_player.state === "czar_picking" && 
              typeof this.czar_select_callback !== "undefined" &&
              typeof this.czar_selected !== "undefined"
    },
    can_czar_select() {
      return this.this_player.state === "czar_picking" && 
              typeof this.czar_select_callback !== "undefined"
    },
    can_select() {
      return typeof this.card_confirm_callback !== "undefined" &&
              this.this_player.state === "picking"
    },
    hand_cards() {
      return this.$store.state.cards;
    },
    played_cards() {
      return this.$store.state.played_cards;
    },
    black_card() {
      return this.$store.state.game_state.black_card
    },
    round_time() {
      return this.$store.state.game_settings.round_time*1000
    },
    match_state() {
      return this.$store.state.game_state.match_state
    },
    game_players() {
      return this.$store.state.game_state.players;
    },
    this_player() {
      return this.$store.state.game_state.players.find(player => {
        return player.id === this.$store.state.player.id;
      })
    },
  },
  watch: {
    match_state(newState, oldState) {
      if (newState === "players_selecting") {
        this.selected_cards = [];
        this.czar_selected = undefined;
        this.start_interval();
      }
      if (newState === "czar_selecting") {
        this.start_interval();
      }
    },
  },
  created() {
    this.$socket.$subscribe('request_cards', callback => {
      this.start_interval(); // make sure countdown is started
      this.card_confirm_callback = callback;
    })

    this.$socket.$subscribe('select_winner', callback => {
      this.start_interval();
      this.czar_select_callback = callback;
    })

    // when created state could already be selecting, start timer
    // TODO: maybe add time in between rounds
    if (this.match_state === "players_selecting") {
      this.start_interval()
    }
  },
  beforeDestroy() {
    this.$socket.$unsubscribe('request_cards');
    this.$socket.$unsubscribe('select_winner');
  }

}
</script>
