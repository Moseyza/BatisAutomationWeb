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
import Letter from './components/Letter/Letter.vue';
import { LetterDto } from '@/store/models';
import store from '@/store';
@Component({
  store,
  components:{Letter}
})
export default class App extends Vue {
  
  letters: LetterDto[] = [];
  async created(){
    this.$router.replace({name: "Login"});
    //const letterList =   await api.getLetters();
    //this.letters = letterList.letters;
  }
}

</script>


<style>

</style>
