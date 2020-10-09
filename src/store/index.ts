import Vue from 'vue'
import Vuex from 'vuex'
import {userModule} from '@/store/moduels/userModule';
import LetterSearch from './models/Letter/letterSearch';


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
    canSeeAllLetters: false,
    advancedSearchSettings: {} as LetterSearch,
    eventHub:  new Vue(),
    version: '2.1.36'


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
    },
    setAdvancedSearchSettings(state,advancedSearchSettings: LetterSearch){
      state.advancedSearchSettings = advancedSearchSettings;
    }

  },
  actions: {
  },
  modules: {
    a: userModule
  }
})
