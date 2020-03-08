<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as api from './store/api';
@Component({
  components:{}
})
export default class App extends Vue {
  @Prop() private msg!: string;
  async created(){
    
    const a =   await api.getLetters();
    console.log("a is:");
    console.log(a);

  }
}

</script>


<style>

</style>
