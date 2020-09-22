<template>
    <div class="letter-container" @click="select">
        <div style="flex:0 0 3px" :style="priorityColor"></div>
        <div style="flex:1 0 0" class="single-letter" :class="{'selected-letter': letterData.isSelected}">
            <div class="letter-title">
                 {{letterData.title}}
            </div>
            <div class="symmetric-grid">
                <div style="flex:2">
                    <div style="display:inline;" class="letter-audience">
                        <div v-if="isSent == false" class="small-text">
                            {{letterData.sender.nameOnly}}
                        </div>
                        <div v-if="isSent" >
                            {{receiverStr}}
                        </div>
                    </div>
                </div>
                <div class="letter-text" style="flex:1; text-align:left;">
                            {{letterData.letterNo}}
                </div>
            </div>
            <div class="symmetric-grid">
                <div  class="letter-date small-text" >
                    {{sendTime}}
                </div>
                <div  style="display:flex; justify-content:space-around ">
                    <!-- v-on:before-enter="beforeEnter"
                    v-on:enter="enter"
                    v-on:leave="leave"
                    v-bind:css="false" -->
                    <transition name="bounce">
                        <div style="flex:1;margin:5px" v-if="letterData.isForwarded || isSentDraft"> <i class="fixed-icon icon-forwardedLetter"></i> </div>
                    </transition>
                    <transition name="bounce">
                        <div style="flex:1;margin:5px" v-if="letterData.isClosed"> <i class="fixed-icon icon-closedLetter"></i> </div>
                    </transition>
                    <div style="flex:1;margin:5px" v-if="isDraft"> <span  class="fixed-icon icon-allDraft"></span></div>
                    <div style="flex:1;margin:5px" v-else-if="letterData.isOpenned || isSent || isOpenned"> <span  class="fixed-icon icon-openLetter"></span></div>
                    <div style="flex:1;margin:5px" v-else> <span  class="fixed-icon icon-notOpenLetter"></span></div>
                    <div style="flex:1;margin:5px" v-if="!letterData.isMainPossession"> <span  class="fixed-icon icon-copyLetter"></span></div>
                    <div style="flex:1;margin:5px" v-if="letterData.isEnterpriseForm"> <i class="fixed-icon icon-enterpriseForm"></i> </div>
                    
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import {Vue, Prop, Component} from 'vue-property-decorator'
import {Letter} from "@/store/models/Letter/Letter";
import {getPersianDate} from "@/util/utils";
import * as api from '@/store/Services/letterServices';
import { DateBaseOnCurrentTimeConverter } from '@/util/dateConverter';
import * as letterService from '@/store/Services/letterServices';
import { DraftLetter } from '../../../../store/models/Letter/DraftLetter';
import * as Velocity from 'velocity-animate';
import * as enterpriseFormService from '@/store/Services/enterpriseFormService';

@Component
export default class SingleLetter extends Vue{
    @Prop() letterData?: Letter 
    isSent = false;
    isOpenned = false;
    @Prop() serverTime?: string;
    @Prop() isDraft?: boolean;
    async created(){
    if(this.letterData === undefined) return;
         if(this.letterData.sender === null || this.letterData.sender === undefined){
             this.isSent = true;
         }

    
    }

    get priorityColor(){
        if(this.letterData === undefined)return '';
        if(this.letterData.priority<5)
            return  {'background-color':'#69b578'};
        if(this.letterData.priority === 5)
            return  {'background-color':'#e9c46a'}; 
        else
            return {'background-color':'#ff6b6b'};
    }

    get  sendTime(){
        if(this.letterData === undefined) return '';
        if(!this.serverTime) return '';
        //return getPersianDate(this.letterData.sendTime,'MM/DD',false);
        const dateConverter = new  DateBaseOnCurrentTimeConverter();
        return   dateConverter.getDateString(new Date(this.letterData.sendTime.substring(0,this.letterData.sendTime.length -1)),this.serverTime)
    }

    async select(){
        
        if(this.letterData === undefined)return;
        if(this.isDraft){
           this.$emit("letterselected",this.letterData.letterPossessionId);
        }
        else{
            if(this.letterData.isOpenned === false){
                api.OpenLetter(this.letterData.letterPossessionId);
                if(this.letterData.isEnterpriseForm)
                   if( await enterpriseFormService.IsFormAutoClose(this.letterData.enterpriseFormId))
                        this.letterData.isClosed = true;
            }
            this.isOpenned = true;
            //this.letterData.isOpenned = true;
            this.$emit("letterselected",this.letterData.letterPossessionId);
        }
    }

    get receiverStr(){
        if(!this.letterData)return '';
        if(!this.letterData.recievers)return '';
        if(this.letterData.recievers.length > 1) return this.letterData.recievers[0].nameOnly + ' و بیشتر...';
        return this.letterData.recievers[0].nameOnly;
    }

    get isSentDraft(){
        if(!this.letterData) return false;
        const draftLetter = this.letterData as DraftLetter;
        if(!draftLetter)return false;
        if(!draftLetter.childLetters)return false;
        return draftLetter.childLetters.length > 0 ;
    }
    beforeEnter(el: any) {
      el.style.opacity = 0
      el.style.transformOrigin = 'left'
    }
    enter(el: any, done: any) {
      Velocity(el, { opacity: 1, fontSize: '2em', color:'red' }, { duration: 300 })
      Velocity(el, { fontSize: '1em' }, { complete: done })
    }
    leave(el: any, done: any) {
      Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
      Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
      Velocity(el, {
        rotateZ: '45deg',
        translateY: '30px',
        translateX: '30px',
        opacity: 0
      }, { complete: done })
    }
    

}

</script>


  <style lang="less">
    @import './../../../../assets/styles/colors.less';
    .letter-container{
        display: flex;
        flex-direction: row;
        align-content: stretch;
        margin: 3px;
        overflow: hidden;
        cursor: pointer;
    }
    .letter-container:hover{
        border: .5px solid @color-primary;
    }
     .single-letter{
        height: 80px;
        background-color: @back-color3;
        padding: 3px 5px 3px 5px;
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        
    }
    .letter-text{
        color: @color-font;
        font-size: 10pt;
    }
    .letter-title{
        color: @color-font;
        // width: 90%;
        max-width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .letter-audience{
        color: @color-primary;
        //font-size: 10pt;

    }
    .letter-date{
        color: @color-icon;
        //font-size: 12pt;

    }
    table{
        width: 100%;
    }
    .bounce-enter-active {
    animation: bounce-in .5s;
    }
    .bounce-leave-active {
    animation: bounce-in .5s reverse;
    }
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(2.2);
  }
  100% {
    transform: scale(1);
  }
}
   

</style>


