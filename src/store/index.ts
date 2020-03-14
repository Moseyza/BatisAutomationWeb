import Vue from 'vue'
import Vuex from 'vuex'
import {userModule} from '@/store/moduels/userModule.ts'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    a: userModule
  }
})
