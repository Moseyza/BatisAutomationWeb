<template>
    <div class="single-letter">
        <div>
            عنوان: {{title}}
        </div>
        <div>
            شماره: {{number}}
        </div>
        <div>
            از: {{from}}
        </div>
        <div>
            خلاصه: {{abstract}}
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
    isOpenned = false;
    created(){
        if(!this.letterData) return;
        this.id = this.letterData.id;
        this.number = this.letterData.letterNo;
        this.title = this.letterData.title;
        this.abstract = this.letterData.abstract;
        this.isClosed = this.letterData.isClosed;
        this.isSecured = this.letterData.isSecured;
        this.from = this.letterData.sender.name;
        this.isOpenned = this.letterData.isOpenned;
        
    }
   
}

</script>


<style scoped>
    .single-letter{
        border:black 1px solid;
        margin: 10px;
    }
</style>

