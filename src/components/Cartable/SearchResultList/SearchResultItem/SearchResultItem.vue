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
                            {{letterData.from.nameOnly}}
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
                    <div style="flex:1;margin:5px" v-if="letterData.isForwarded"> <i class="fixed-icon icon-forwardedLetter"></i> </div>
                    <div style="flex:1;margin:5px" v-if="letterData.isClosed"> <i class="fixed-icon icon-closedLetter"></i> </div>
                    <div style="flex:1;margin:5px" v-if="letterData.isOpenned || isSent"> <span  class="fixed-icon icon-openLetter"></span></div>
                    <div style="flex:1;margin:5px" v-else> <span  class="fixed-icon icon-notOpenLetter"></span></div>
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
import { LetterSearchResult } from '../../../../store/models/Letter/LetterSearchResult';

@Component
export default class SearchResultItem extends Vue{
    @Prop() letterData?: LetterSearchResult 
    isSent = false;
    @Prop() serverTime?: string;
    
    async created(){
    if(this.letterData === undefined) return;
         if(this.letterData.from === null || this.letterData.from === undefined){
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
        if(!this.serverTime)return '';
        const dateConverter = new  DateBaseOnCurrentTimeConverter();
        return   dateConverter.getDateString(new Date(this.letterData.sendTime.substring(0,this.letterData.sendTime.length -1)),this.serverTime)
    }

    select(){
        
        if(this.letterData === undefined)return;
        this.$emit("letterselected",this.letterData.possessionId);
        
    }

      get receiverStr(){
        if(!this.letterData)return '';
        if(!this.letterData.to)return '';
        if(this.letterData.to.length > 1) return this.letterData.to[0].nameOnly + ' و بیشتر...';
        return this.letterData.to[0].nameOnly;
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
        background-color: var(--SingleLetter);
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
        color: var(--TxtColor);
        //font-size: 12pt;

    }
    table{
        width: 100%;
    }
   

</style>


