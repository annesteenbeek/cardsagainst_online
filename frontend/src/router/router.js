import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import { create } from 'vue-modal-dialogs';

import Lobby from '@/views/Lobby.vue';
import Game from '@/views/Game.vue';

import JoinGamePrompt from '@/components/JoinGamePrompt';
import SetNamePrompt from '@/components/SetNamePrompt';

Vue.use(VueRouter)

const gameAuth = create(JoinGamePrompt, 'route_game_id');
const setName = create(SetNamePrompt);

const routes = [
  {
    path: '/',
    name: 'lobby',
    component: Lobby 
  },
  {
    path: '/game/:game_id',
    name: 'game',
    component: Game,
    beforeEnter: (to, from, next) => {
      // does this game still exist?
      // am i already in the game?
      // can i enter the game? (full/started)
      // does it require password?
      // Try to enter

      // TODO: check if modal is already mounted
      let route_game_id = to.params.game_id;
      setTimeout(()=>{
        gameAuth(route_game_id).then((data) => {
          next();
        }).catch((error) => {
          store.dispatch('error_banner', error)
          // TODO: warn about error and redirect to lobby
          next('/')
          // router.push({name: 'lobby'}).catch(err=> {
            // router duplicate ignore
          // })
        })
      }, 100);
    },
    // children: [
    //   {
    //     path: '/settings',
    //     component: GameSettings
    //   }
    // ]

  }
]

const router = new VueRouter({
  routes
})

router.beforeEach(async (to, from, next) => {
  // await Vue.nextTick()
  // next();
  if (store.state.player.name === "") {
    console.log("player name needs to be set")
    setTimeout(() => {
        setName().then((data) => {
          next();
        }).catch((error) => {
          console.error(error)
          next();
        })
    }, 100);
  } else {
    next();
  }
})

export default router
