<template>
    <div id="letter-container" @click="select">
        <div style="flex:0 0 3px" :style="priorityColor"></div>
        <div style="flex:1 0 0" class="single-letter" :class="{selected: letterData.isSelected}">
            <table>
                <tr>
                    <div class="letter-title">
                        {{letterData.title}}
                    </div>
                </tr>
                <tr>
                    <td>
                        <div style="display:inline" class="letter-audience">
                            <div v-if="isSent == false">
                            {{letterData.sender.nameOnly}}
                        </div>
                        <div v-if="isSent">
                            <span v-for="receiver in letterData.recievers" :key="receiver" > {{receiver}} <br> </span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="letter-text" style="display:inline; float:left">
                            {{letterData.letterNo}}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="letter-date" >
                            {{sendTime}}
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script lang="ts">

import {Vue, Prop, Component} from 'vue-property-decorator'
import {Letter} from "@/store/models/Letter/Letter";
import {getPersianDate} from "@/util/utils";

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
        return getPersianDate(this.letterData.sendTime,'MM/DD');
    }

    select(){
        if(this.letterData === undefined)return;
        this.$emit("letterselected",this.letterData.id);
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
    }
     .single-letter{
        height: 100px;
        background-color: @back-color3;
        padding: 3px 5px 3px 5px;
    }
    .letter-text{
        color: @color-font;
        font-size: 10pt;
    }
    .letter-title{
        color: @color-font;
    }
    .letter-audience{
        color: @color-primary;
        font-size: 10pt;

    }
    .letter-date{
        color: @color-icon;
        font-size: 12pt;

    }
    table{
        width: 100%;
    }
    .selected{
        background-color: @back-color5;
    }

</style>


