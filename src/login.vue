<template>
    <div>
        <input type="text" placeholder="نام کاربری" v-model="userName">
        <input type="password" placeholder="کلمه عبور" v-model="password">
        <span :class="{hide: isUserValid  }" >نام کاربری یا کلمه عبور نادرست است</span>
        <button @click="login">ورود</button>        
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'; 
import store from '@/store';
import * as api from '@/store/api'
import {notFilter} from './filters/filters';
@Component({
    store,
    filters: {
        notFilter: notFilter,
    }
})
export default class Login extends Vue {
  
  userName = '';
  password = '';
  isUserValid = true;
  async login(){
      this.isUserValid =  await api.isUserValid(this.userName,this.password);
      if(this.isUserValid){
          this.$store.commit("setIsLoggedIn",true);
          this.$router.replace({name: "MainWindow"});

      }
  }

}

</script>

<style  scoped>
    
    span{
        color:red;
    }
    .hide{
        display: none;
    }
</style>

