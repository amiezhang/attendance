import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

export default new vuex.Store({
  state: {
    isLogin: false,
    name: '',
    roles: [],
    isCollapse: false,
    activedRouter: [],
    activeName: ''
  },
  mutations: {
    setLogin (state, opts) {
      state.roles = opts.roles
      state.name = opts.name
      state.isLogin = opts.isLogin
    },
    resetLogin (state) {
      state.roles = []
      state.name = ''
      state.isLogin = false
    },
    triggerCollapse(state) {
      state.isCollapse = !state.isCollapse
    },
    addTag(state, tag) {
      let arr = state.activedRouter.filter(item => item.name == tag.name)
      if(arr.length == 0) {
        state.activedRouter.push(tag)
      }
      state.activeName = tag.name
    },
    closeTag(state, key) {
      state.activedRouter = state.activedRouter.filter(item => item.name !== key)
    },
    setActive(state, key) {
      state.activeName = key
    }
  }
})
