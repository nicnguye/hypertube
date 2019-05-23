// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueFlashMessage from 'vue-flash-message'
import { sync } from 'vuex-router-sync'
import store from '@/store/store'
import VueLocalStorage from 'vue-localstorage'
import axios from 'axios'
import VueI18n from 'vue-i18n'
import lang from './language.js';


Vue.use(VueResource)
Vue.use(Vuetify)
Vue.use(VueLocalStorage)
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  messages:  lang
})

sync(store, router)

Vue.config.productionTip = false;
Vue.http.options.root = 'http://localhost:8081/';
Vue.http.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:8081';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
