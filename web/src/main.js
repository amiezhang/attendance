// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import store from '@/store'
import el from 'element-ui'
import axios from 'axios'

Vue.use(el)

function handleErr(err) {
    this.$message({
        type: 'error',
        message: err.length < 25 ? err : err.substring(0, 25) + '...'
    });
    console.error(err)
}
axios.interceptors.response.use(response => {
    const data = response.data
    if(data.code == 1) {
        return data.msg
    } else if (data.code == -1) {
      alert('登陆过期，请重新登陆')
      app.$router.push('/login')
    } else {
        handleErr.call(app,data.msg)
        throw data.msg
    }
}, err => {
    handleErr.call(app,data.msg)
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
let app = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
