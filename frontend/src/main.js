import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { sync } from 'vuex-router-sync';
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';
import './quasar';
import * as ModalDialogs from 'vue-modal-dialogs';
import VueResizeText from 'vue-resize-text';

Vue.config.productionTip = false

var url = window.location;
if (process.env.NODE_ENV === 'development') {
  url = "http://localhost:8003";
}

// TODO: fix url in production
// const socket = io(url);
const socket = io();

Vue.use(VueResizeText);
Vue.use(ModalDialogs);
Vue.use(VueSocketIOExt, socket, {store});
const unsync = sync(store,router);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
