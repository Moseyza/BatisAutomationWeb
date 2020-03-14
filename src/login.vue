<template>
    <div>
        <input type="text" placeholder="نام کاربری" v-model="userName">
        <input type="password" placeholder="کلمه عبور" v-model="password">
        <span v-if="isInvalid" >نام کاربری یا کلمه عبور نادرست است</span>
        <button @click="login">ورود</button>        
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'; 
import store from '@/store';
import * as api from '@/store/api'

@Component({
    store,
    components:{}
})
export default class Login extends Vue {
  
  userName: string = '';
  password: string = '';
  isInvalid: boolean = false;
  async login(){
      this.isInvalid = ! await api.isUserValid(this.userName,this.password);
      if(!this.isInvalid){
          this.$router.replace({name: "Cartable"});

      }
  }

}

</script>

<style  scoped>
    .span{
        color:red;
    }
</style>

