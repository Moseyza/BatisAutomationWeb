<template>
<div id="container" class="container5">
    <SingleCartableOwner @on-letter-owner-set="onLetterOwnerSet($event)"/>
    <div>
        {{branch}}
    </div>
    <div style="direction: ltr">
       {{currentDate}}  {{currentTime}}
    </div>
</div>    
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import SingleCartableOwner from '@/components/Cartable/CartableOwner/SingleCartableOwner.vue';
import { getPersianDate } from '@/util/utils';
import { getBranches } from '@/store/api';
import * as letterService from '@/store/Services/letterServices';

@Component({
    components: {SingleCartableOwner}
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
