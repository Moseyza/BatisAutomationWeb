<template>
  <div id="app">
   
    
    <!-- <Letter 
    v-for="letter in letters"
    :letterData="letter"
    :key="letter.id"
    >
    </Letter> -->
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as api from './store/api';
import { LetterDto } from '@/store/models';
import store from '@/store';
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
    //const letterList =   await api.getLetters();
    //this.letters = letterList.letters;
  }
}

</script>


<style>
  div{
    direction: rtl;
  }
</style>
