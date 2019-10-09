// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueSocketIO from 'vue-socket.io';
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.css";

import App from './App'
import router from './router'

Vue.use(BootstrapVue);
Vue.use(Vuetify);
Vue.use(new VueSocketIO({
  debug: true,
  connection: "http://localhost:3001",
}))

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  sockets: {
    connect() {
      console.log("socket connected...")
    },
    disconnected() {
      console.log("socket disconnected...")
    }
  },
  template: '<App/>'
})
