<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as api from './store/api';
import { LetterDto } from '@/store/models';
import store from '@/store';
require("./assets/scripts/semantic.min.js");
@Component({
  store,
})
export default class App extends Vue {
  
  letters: LetterDto[] = [];
  async created(){
    if(store.state.isLoggedIn === false)
      this.$router.replace({name: "Login"});
    else 
      this.$router.replace({name: "MainWindow"});
     
  }
}

</script>


<style lang="less">
@import './assets/styles/semantic.min.css';
@import './assets/styles/styles.less';
@import './assets/styles/flexStyles.less';
@import './assets/styles/icons.css';
</style>

