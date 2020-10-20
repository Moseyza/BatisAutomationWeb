<template>
    <div class="container">
        <div class=" landscape ui centered grid" style="margin:0">
            <div class="container5" style="border-radius:4px;">
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
        <div class="portrait largSize ui centered grid" style="margin:0;">
            <div class="login-form container5 row">
                <div class="four wide column" style="display: flex;align-items: center;">
                    <div id ="imageContainer">
                        <img src="@/assets/logo.png" style="width: 100px; height: 100px" alt="">
                    </div>
                </div>
                <div class="twelve wide column">
                    <div>
                        <div style="text-align:center">
                            برای ورود اطلاعات را وارد کنید
                        </div>
                        <div class="ui input with-top-margin" style="display:flex;flex-direction: column;justify-content:center;align-items:center" >
                            <label class="form-label"> نام کاربری</label>
                            <input class="form-input" style="font-size:15pt;border-radius:5px" type="text" v-model="userName">
                        </div>
                        <div class="ui input"  style="display:flex;flex-direction: column;justify-content:center;align-items:center">
                            <label class="form-label">گذرواژه</label>
                            <input class="form-input" style="font-size:15pt;border-radius:5px" type="password"  v-model="password">
                        </div>
                    </div>
                    <div>
                        <div  class="ui error message" :class="{hide: isUserValid,'danger-label':true}" >نام کاربری یا گذرواژه نادرست است</div>
                    </div>
                    <div style="margin-top:10px">
                            <button class='form-button-primary' style="font-size:15pt;border-radius:5px;cursor:pointer" @click="login">ورود</button> 
                    </div>
                    <div style="text-align:center">
                        شرکت ایده پردازان باتیس
                    </div>
                    <div class="center black label">
                        <div style="text-align:left;font-size:7pt">Version: {{version}}</div>   
                    </div>
                </div>
            </div>  
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
    @media (min-width: 0px ) and (max-width: 414px) {
        .portrait{
            display: none !important;
        }
    }

    @media (min-width: 415px ) and (max-width: 823px) {
        .landscape{
            display: none !important;
        }
    }

    @media (min-width: 824px ) and (max-width: 14000px) {
        .largSize{
            display: none !important;
        }
    }

    .container{
        height: 100%;
        display: flex;
        align-content: center;
        align-items: center;
    }

    .login-form{
        width:30%;
        margin:0 auto;
        padding: 20px;
        border-radius: 8px;

    }
   
    .hide{
        display: none;
    }
    
</style>

