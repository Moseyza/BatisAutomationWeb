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
            <input class="form-input" type="text" v-model="userName">
        </div>
        <div class="form-label">
            گذرواژه
        </div>
        <div>
            <input class="form-input" type="password"  v-model="password">
        </div>
        <div>
             <div :class="{hide: isUserValid,'danger-label':true}" >نام کاربری یا گذرواژه نادرست است</div>
        </div>
        <div>
            <button class='form-button-primary' @click="login">ورود</button> 
        </div>
           <div style="text-align:center;font-size:8pt">
            شرکت ایده پردازان باتیس
        </div>   
                   
        </div>
     
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
    #container{
        
        height: 100%;
        display: flex;
        align-content: center;
        align-items: center;
    }
    #login-form{
        width: 25%;
        margin:0 auto;
        padding: 20px;

    }
   
    .hide{
        display: none;
    }
    


</style>

