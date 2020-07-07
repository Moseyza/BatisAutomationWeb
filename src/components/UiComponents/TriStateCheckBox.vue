<template>
    <div class="tris-checkbox" @click="changeState()">
        <i style="color:#5f5f5f;font-size:9pt" :class="{'icon-comboBoxButton':state === 'dontCare','icon-check':state === 'checked' }"></i>
    </div>    
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
@Component
export default class TriStateCheckBox extends Vue{
    @Prop() stateProp?: string;
    @Watch('stateProp')
    onStatePropChanged(nVal: string, oVal: string){
        this.state = nVal;
    }
    state = 'dontCare';
    changeState(){
        if(this.state === 'dontCare')
            this.state = 'checked';
        else if(this.state === 'checked')
            this.state = 'unChecked';
        else if(this.state === 'unChecked')
            this.state = 'dontCare';
        this.$emit('state-changed',this.state);
        //alert(this.state);
    }
}
</script>

<style lang="less">
    .tris-checkbox{
        width: 16px;
        height: 16px;
        border: 1px solid gray;
        border-radius: 3px;
        background-color: whitesmoke;
        padding-top: 1px;
        padding-left: 1px;
    }
     .tris-checkbox:hover{
         background-color: darkgray;
     }
</style>
