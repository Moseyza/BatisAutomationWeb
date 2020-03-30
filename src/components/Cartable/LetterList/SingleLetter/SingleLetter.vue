<template>
    <div class="single-letter">
        <div>
            عنوان: {{title}}
        </div>
        <div>
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
        </div>

        <div :style="priorityColor">This is color</div>
       
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
                    this.to.push(receiver.name);
            });
            }
        }
        else{
            this.from = this.letterData.sender.name;
        }
        
        this.isOpenned = this.letterData.isOpenned;
        
    }

    get priorityColor(){
        if(this.priority<5)
            return  {'background-color':'#69B577'};
        if(this.priority === 5)
            return  {'background-color':'#E9C46B'}; 
        else
            return {'background-color':'#FF6B6B'};
    }
   
}

</script>


<style scoped>
    .single-letter{
        border:black 1px solid;
        margin: 10px;
    }
</style>

