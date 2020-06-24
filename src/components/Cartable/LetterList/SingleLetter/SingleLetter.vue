<template>
    <div id="letter-container" @click="select">
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
                        <div v-if="isSent" style="max-height:20px;overflow:auto">
                            <span class="small-text" v-for="(receiver,index) in letterData.recievers" :key="index+receiver.id" > {{receiver.nameOnly}} <br> </span>
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
                <div>
                    <span v-if="letterData.isOpenned" class="fixed-icon icon-openLetter"></span>
                    <span v-else class="fixed-icon icon-notOpenLetter"></span>
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


@Component
export default class SingleLetter extends Vue{
    @Prop() letterData?: Letter 
    isSent = false;
    
    created(){
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

    get sendTime(){
        if(this.letterData === undefined) return '';
        //return getPersianDate(this.letterData.sendTime,'MM/DD',false);
        const dateConverter = new  DateBaseOnCurrentTimeConverter();
        return dateConverter.getDateString(new Date(this.letterData.sendTime.substring(0,this.letterData.sendTime.length -1)))
    }

    select(){
        
        if(this.letterData === undefined)return;
        if(this.letterData.isOpenned === false){
            api.OpenLetter(this.letterData.letterPossessionId);
        }
        this.letterData.isOpenned = true;
        //alert(this.letterData.letterPossessionId);
        this.$emit("letterselected",this.letterData.letterPossessionId);
        
    }

}

</script>


  <style lang="less">
    @import './../../../../assets/styles/colors.less';
    #letter-container{
        display: flex;
        flex-direction: row;
        align-content: stretch;
        margin: 3px;
        overflow: hidden;
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
   

</style>


