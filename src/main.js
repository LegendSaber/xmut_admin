import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import http from './utils/http'

Vue.prototype.$axios = http

Vue.config.productionTip = false

Vue.use(ElementUI, {
    size: 'small',
    zIndex: 3000
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})