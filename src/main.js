import Vue from 'vue'
import VeLine from 'v-charts/lib/line.common'
import VeHistogram from 'v-charts/lib/histogram.common'
import VePie from 'v-charts/lib/pie.common'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import http from './utils/http'
import '@/assets/css/global.css'
import xss from 'xss'
import md5 from 'js-md5'

Vue.prototype.$axios = http
Vue.prototype.$xss = xss
Vue.prototype.$md5 = md5

Vue.config.productionTip = false

Vue.use(ElementUI, {
    size: 'small',
    zIndex: 3000
})
Vue.component(VeLine.name, VeLine)
Vue.component(VeHistogram.name, VeHistogram)
Vue.component(VePie.name, VePie)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})