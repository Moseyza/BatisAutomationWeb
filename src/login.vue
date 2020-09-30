<template>
    <div id="container">
       
        <div id="login-form" class="container5">
        <div style="text-align: center;">
             <img src="@/assets/logo.png" style="width: 100px; height: 100px" alt="">
        </div>
        <div class="form-label" style="text-align: center;font-size:9pt">
            برای ورود اطلاعات را وارد کنید
        </div>
        <div class="form-label">
            نام کاربری
        </div>
        <div>
            <input class="form-input" style="font-size:15pt;border-radius:5px" type="text" v-model="userName">
        </div>
        <div class="form-label">
            گذرواژه
        </div>
        <div>
            <input class="form-input" style="font-size:15pt;border-radius:5px" type="password"  v-model="password">
        </div>
        <div>
             <div :class="{hide: isUserValid,'danger-label':true}" >نام کاربری یا گذرواژه نادرست است</div>
        </div>
        <div style="margin-top:10px">
            <button class='form-button-primary' style="font-size:15pt;border-radius:5px;cursor:pointer" @click="login">ورود</button> 
        </div>
           <div style="text-align:center;font-size:8pt">
            شرکت ایده پردازان باتیس
        </div>   
                <div style="text-align:left;font-size:7pt">Version: {{version}}</div>   
        </div>
     
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'; 
import store from '@/store';
import * as api from '@/store/api'
import {notFilter} from './filters/filters';
import {Letter} from '@/store/models/Letter/Letter'
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
  version = "";
  created(){
      this.version = store.state.version;
  }
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
    #container{
        
        height: 100%;
        display: flex;
        align-content: center;
        align-items: center;
    }
    #login-form{
        width:30%;
        margin:0 auto;
        padding: 20px;
        border-radius: 8px;

    }
   
    .hide{
        display: none;
    }
    


</style>

