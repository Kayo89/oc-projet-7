import Vue from 'vue'
import App from './App.vue'
import router from './router'
import moment from 'moment'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import store from './store'

Vue.config.productionTip = false
Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY à HH:mm')
  }
});
Vue.filter('formatDateFromNow', function(value) {
  if (value) {
    return moment(String(value)).fromNow();
  }
});

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
