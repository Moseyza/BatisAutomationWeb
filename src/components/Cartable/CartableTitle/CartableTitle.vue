<template>
<div id="container" class="container5">
    <SingleCartableOwner/>
    <div>
        {{branch}}
    </div>
    <div style="direction: ltr">
       {{currentDate}} : {{currentTime}}
    </div>
</div>    
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import SingleCartableOwner from '@/components/Cartable/CartableOwner/SingleCartableOwner.vue';
import { getPersianDate } from '@/util/utils';
import { getBranches } from '@/store/api';

@Component({
    components: {SingleCartableOwner}
})
export default class CartableTitle extends Vue{
    clock = 0;
    currentTime = '';
    currentDate = '';
    branch = '';
    async created(){
        this.clock = setInterval(()=>{
            const d = new Date();
            this.currentTime = d.toLocaleTimeString();
            this.currentDate = getPersianDate((new Date()).toString(),"YYYY/MM/DD",false);
        }, 1000);
        const branches =  await getBranches();
        this.branch = branches[0].name;
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
