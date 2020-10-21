<template>
<div id="container" class="container5">
    <SingleCartableOwner style="display: flex;align-items: center;" @on-letter-owner-set="onLetterOwnerSet($event)"/>
    <div style="display: flex;align-items: center;">
        {{branch}}
    </div>
    <div style="display:flex; direction: ltr">
       <ThemeSelector style="margin:0em 1em 0em 1em;"/>
        <div style="display: flex;align-items: center;">
            {{currentDate}}  {{currentTime}}
       </div>
    </div>
    
</div>    
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import SingleCartableOwner from '@/components/Cartable/CartableOwner/SingleCartableOwner.vue';
import { getPersianDate } from '@/util/utils';
import { getBranches } from '@/store/api';
import * as letterService from '@/store/Services/letterServices';
import ThemeSelector from '@/components/UiComponents/ThemeSelector.vue';

@Component({
    components: {SingleCartableOwner, ThemeSelector}
})
export default class CartableTitle extends Vue{
    clock = 0;
    currentTime = '';
    currentDate = '';
    branch = '';
    async created(){
        const serverTime = new Date(await letterService.getServerTime());
        
        this.clock = setInterval(()=>{
            const d =  serverTime;//new Date();
            this.currentTime = d.toLocaleTimeString();
            this.currentDate = getPersianDate((new Date()).toString(),"YYYY/MM/DD",false);
            d.setSeconds(d.getSeconds() + 1);
        }, 1000);
        const branches =  await getBranches();
        this.branch = branches[0].name;
    }

    onLetterOwnerSet(e: boolean){
        this.$emit('on-letter-owner-set',e);
    }
}
</script>

<style lang="less" scoped>
#container{
    display:flex;
    justify-content:space-between;
    border-radius: 0px;
    
}
</style>
