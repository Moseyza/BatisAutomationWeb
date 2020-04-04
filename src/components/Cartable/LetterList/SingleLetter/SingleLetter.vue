<template>
    <div id="letter-container">
        <div style="flex:0 0 3px" :style="priorityColor"></div>
        <div style="flex:1 0 0" class="single-letter">
            <div class="letter-title">
                 {{title}}
            </div>
            <div class="letter-audience">
                <div v-if="isSent == false">
                    {{from}}
                </div>
                <div v-if="isSent">
                    <span v-for="receiver in to" :key="receiver" > {{receiver}} <br> </span>
                </div>
            </div>
            
            <!-- <div>
                شماره: {{number}}
            </div>
            <div v-if="isSent == false">
                از: {{from}}
            </div>
            <div v-if="isSent">
                به:
                <span v-for="receiver in to" :key="receiver" > {{receiver}} <br> </span>
            </div>
            <div>
                خلاصه: {{abstract}}
            </div> -->


        </div>
    </div>
</template>


<script lang="ts">

import {Vue, Prop, Component} from 'vue-property-decorator'
import Letter from "@/store/models/Letter/Letter";

@Component
export default class SingleLetter extends Vue{
    @Prop() letterData?: Letter 
    id = '';
    number = '';
    title = '';
    abstract = '';
    isSecured = false;
    isSelected = false;
    isClosed = false;
    from = '';
    to: (string)[] = [];
    isOpenned = false;
    isSent = false;
    priority = 0;
    
    created(){
        if(!this.letterData) return;
        this.id = this.letterData.id;
        this.number = this.letterData.letterNo;
        this.title = this.letterData.title;
        this.abstract = this.letterData.abstract;
        this.isClosed = this.letterData.isClosed;
        this.isSecured = this.letterData.isSecured;
        this.priority = this.letterData.priority;
        if(this.letterData.sender === null || this.letterData.sender === undefined){
            this.isSent = true;
            if(this.letterData.recievers !== undefined && this.letterData.recievers !== null){
            this.letterData.recievers.forEach(receiver => {
                    this.to.push(receiver.nameOnly);
            });
            }
        }
        else{
            this.from = this.letterData.sender.nameOnly;
        }
        
        this.isOpenned = this.letterData.isOpenned;
        
    }

    get priorityColor(){
        if(this.priority<5)
            return  {'background-color':'#69b578'};
        if(this.priority === 5)
            return  {'background-color':'#e9c46a'}; 
        else
            return {'background-color':'#ff6b6b'};
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
        //padding: 8px;
    }
     .single-letter{
        //border: @color-danger 1px solid;
        
        height: 100px;
        background-color: @back-color3;
        padding: 3px;
        
    }
    .letter-title{
        color: @color-font;
    }
    .letter-audience{
        color: @color-primary;

    }

</style>


