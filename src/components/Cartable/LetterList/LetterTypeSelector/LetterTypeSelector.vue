<template>
    <div class="symmetric-grid">
        <div class="type-btn" :class="{selected:firstSelected}" @click="select(1)" >{{firstButtonTxt}}</div>
        <div class="type-btn" :class="{selected:secondSelected}" @click="select(2)"  >{{secondButtonTxt}}</div>
        <div class="type-btn" :class="{selected:allSelected}" @click="select(3)"  >{{thirdButtonTxt}}</div>
    </div>    
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';

@Component
export default class LetterTypeSelector extends Vue {
    firstSelected = false;
    secondSelected = false;
    allSelected = true;
    firstButtonTxt = '';
    secondButtonTxt = '';
    thirdButtonTxt = '';
    @Prop() mode?: string;
    @Watch('mode')
    onModeChanged(newVal: string, oldVal: string){
        this.setButtonsText();
        
    }
    unSelectAll(){
        this.allSelected = false;
        this.secondSelected = false;
        this.firstSelected = false;
    }
    select(p: number){
        this.unSelectAll();
        if(p === 1){
            this.firstSelected = true;
            if(this.mode === 'received')
                this.$emit('letter-type-changed',"notRead");
        }else if(p === 2){
            this.secondSelected = true;
            if(this.mode === 'received')
                this.$emit('letter-type-changed','notForwarded');
        }else{
            this.allSelected = true;
             this.$emit('letter-type-changed',"all");
        }
    }
    created(){
        this.setButtonsText();
    }

    setButtonsText(){
        if(this.mode === 'received'){
            this.firstButtonTxt = 'خوانده نشده';
            this.secondButtonTxt = 'ارجاع نشده';
            this.thirdButtonTxt = 'همه';

        }
        else if(this.mode === 'drafts'){
            this.firstButtonTxt = 'ارسال شده';
            this.secondButtonTxt = 'ارسال نشده';
            this.thirdButtonTxt = 'همه';
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

