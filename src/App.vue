<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/> -->
    <h3>نامه ها</h3>
    <hr>
    <Letter 
    v-for="letter in letters"
    :letterData="letter"
    :key="letter.id"
    >
    </Letter>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as api from './store/api';
import Letter from './components/Letter/Letter.vue';
import { LetterDto } from '@/store/models';
@Component({
  components:{Letter}
})
export default class App extends Vue {
  
  letters: LetterDto[] = [];
  async created(){
    
    const letterList =   await api.getLetters();
    this.letters = letterList.letters;
    console.log("letters is:");
    console.log(this.letters);

  }
}

</script>


<style>

</style>
