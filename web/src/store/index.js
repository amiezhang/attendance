import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

export default new vuex.Store({
  state: {
    isCollapse: false,
    activedRouter: [],
    activeName: ''
  },
  mutations: {
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
    },
    clearTag(state) {
      state.activedRouter = []
    }
  }
})
