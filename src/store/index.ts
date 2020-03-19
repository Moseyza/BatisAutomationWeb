import Vue from 'vue'
import Vuex from 'vuex'
import {userModule} from '@/store/moduels/userModule.ts'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authenticationToken: '',
    isLoggedIn: false

  },
  mutations: {
    setAuthenticationToken (state,token)
    {
      state.authenticationToken = token;
    },
    clearToken(state)
    {
      state.authenticationToken = '';
    },
    setIsLoggedIn(state,isLoggedIn){
      state.isLoggedIn = isLoggedIn;
    }
  },
  actions: {
  },
  modules: {
    a: userModule
  }
})
