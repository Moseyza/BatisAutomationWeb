import Vue from 'vue'
import Vuex from 'vuex'
import {userModule} from '@/store/moduels/userModule'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authenticationToken: '',
    isLoggedIn: false,
    userId: '',
    ownerId: '',
    ownerIds: [],
    branchIds:  [],
    workflows: [],
    canSeeAllLetters: false


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
    },
    setUserId(state,userId){
      state.userId = userId;
    },
    clearBranchIds(state)
    {
      state.branchIds = []
    },
    addToBranchIds(state,branchId)
    {
      (state.branchIds as string[]).push(branchId);
      
    },
    setOwnerId(state,ownerId){
      state.ownerId = ownerId;
    },
    setWorkflows(state,workflows){
      state.workflows = workflows;
    },
    setCanSeeAllLetters(state,canSeeAllLetters){
      state.canSeeAllLetters = canSeeAllLetters;
    }

  },
  actions: {
  },
  modules: {
    a: userModule
  }
})
