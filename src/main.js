// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

require('@/style/app.scss')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  data: {
    ranking_maybe: 100,
    ranking_confirmed: 50
  },
  template: '<App/>',
  components: { App }
})

// Small store to hold the constant values
// A banana is maybe recognized if its ranking is >= ranking_maybe
// It is definitely recognized if its ranking is >= ranking_confirmed
export const constants = new Vue({
  data: {
    ranking_maybe: 100,
    ranking_confirmed: 50
  }
})
