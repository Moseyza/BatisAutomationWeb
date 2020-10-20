<template>
    <div style="display:flex;justify-content:space-between">
        <div  style=" width:100%;display:flex;justify-content:flex-start">
            <div style="padding:3px"><button style="padding:3px;cursor:pointer;background-color:var(--BackgroundTable)" @click="toggle('sign')"  :class="{'optionbtn-active':sign}">امضا</button></div>
            <div style="padding:3px"><button style="padding:3px;cursor:pointer;background-color:var(--BackgroundTable)" @click="toggle('setCopy')"  :class="{'optionbtn-active':setCopy}">تنظیم گیرندگان رونوشت</button></div>
        </div>
        <div style="text-align:center" @click="close" class="action-icon" >
            <i style="margin-left:15px;font-size:25pt;" class="icon-close"></i>
        </div>
    </div>
</template>


<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import ToggleSwitch from '@/components/UiComponents/ToggleSwitch.vue';
import * as $ from 'jquery';
@Component({components: {ToggleSwitch} })
export default class InplaceSendingOptions extends Vue {
    @Prop() signProp?: boolean;
    @Prop() setCopyProp?: boolean;
    sign = false;
    setCopy = false;
   
    toggle(mode: string){
        if(mode == 'setCopy')this.setCopy = !this.setCopy;
        if(mode=='sign') this.sign = !this.sign;
        const options = {sign: this.sign, setCopy: this.setCopy};
        this.$emit('toggle-options',options);
    }
   

    created(){
        if(this.signProp) this.sign = this.signProp;
        if(this.setCopyProp) this.setCopy = this.setCopyProp;
    }

    close(){
        this.$emit('close');
    }
}
</script>

<style lang="less" scoped>
    .optionbtn-active{
        background-color: #69b578 !important;
    }
</style>
