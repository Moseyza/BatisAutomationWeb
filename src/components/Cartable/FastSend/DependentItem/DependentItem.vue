<template>
    <div style="display:flex;justify-content:space-around;width:100%">
        <div style="flex:3" class="symmetric-grid simple-rect">
            <div style="overflow:hidden">{{letter.title}}</div>
            <div class="dark-text small-text" >[{{letter.letterNo}}]</div>
        </div>
        <div  style="flex:1;margin-right:5px;text-align:center" class="simple-rect">
            {{dependencyType}}
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Prop, Component} from 'vue-property-decorator'
import { DependentLetter } from '../../../../store/models/Letter/DependentLetter'
@Component
export default class DependentItem extends Vue{
    @Prop() letter?: DependentLetter;
    get dependencyType(){
        if(!this.letter)return '';
        switch(this.letter.dependencyType){
            case 'bending': return 'عطف';
            case 'following': return 'پیرو';
            case 'returning': return 'بازگشت';
            case 'attaching': return 'پیوست به';
            default: return '';
        }
    }

}
</script>

<style lang="less" >
.simple-rect{
    border: 1px solid gray;
    padding: 2px;
    border-radius: 5px;
}
</style>