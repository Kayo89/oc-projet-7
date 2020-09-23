import Vue from 'vue'
import App from './App.vue'
import router from './router'
import moment from 'moment'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faCheckSquare } from '@fortawesome/free-solid-svg-icons'
import { faCode } from '@fortawesome/free-solid-svg-icons'
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons'

library.add(faEnvelope, faLock, faCheckSquare, faCode, faCommentAlt)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY à HH:mm')
  }
});
Vue.filter('formatDateShort', function(value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY')
  }
});
Vue.filter('formatDateFromNow', function(value) {
  if (value) {
    return moment(String(value)).locale("fr").fromNow();
  }
});
Vue.filter('formatDateFromNowAge', function(value) {
  if (value) {
    return moment(String(value)).locale("fr").fromNow(true);
  }
});

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
