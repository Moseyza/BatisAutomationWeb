<template>
    <div class="symmetric-grid">
        <div class="type-btn" :class="{selected:firstSelected}" @click="select(1)" >خوانده نشده</div>
        <div class="type-btn" :class="{selected:secondSelected}" @click="select(2)"  >ارجاع نشده</div>
        <div class="type-btn" :class="{selected:allSelected}" @click="select(3)"  >همه</div>
    </div>    
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component
export default class LetterTypeSelector extends Vue {
    firstSelected = false;
    secondSelected = false;
    allSelected = true;
    unSelectAll(){
        this.allSelected = false;
        this.secondSelected = false;
        this.firstSelected = false;
    }
    select(p: number){
        this.unSelectAll();
        if(p === 1){
            this.firstSelected = true;
        }else if(p === 2){
            this.secondSelected = true;
        }else{
            this.allSelected = true;
        }
    }
}
</script>

<style lang="less" scoped>
.type-btn{
    background-color: #5f5f5f;
    flex: 1;
    text-align: center;
    cursor: pointer;
    margin: 10px 0;
    padding: 5px 0;
    
}
.selected{
    background-color: #939393;
}
</style>

