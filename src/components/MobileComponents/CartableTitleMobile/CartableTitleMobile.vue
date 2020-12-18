<template>
<div id="container" class="container5">
    <div class=" landscape ui centered grid" style="margin: 0px;display: flex;justify-content: end;align-items: center;">
        <div style="display: flex;align-items: center;">
            {{currentDate}}
        </div>
        <div style="display:flex; direction: ltr;flex:1;justify-content: center;">
            <SingleCartableOwnerMobile style="display: flex;align-items: center;" @on-letter-owner-set="onLetterOwnerSet($event)"/>
        </div>
        <ThemeSelector style="margin:0em 1em 0em 1em;"/>
    </div>
    <div class="portrait largSize ui centered grid" style="margin:0;">
        <SingleCartableOwnerMobile style="display: flex;align-items: center;" @on-letter-owner-set="onLetterOwnerSet($event)"/>
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
</div>    
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import SingleCartableOwnerMobile from '@/components/MobileComponents/CartableOwnerMobile/SingleCartableOwnerMobile.vue';
import { getPersianDate } from '@/util/utils';
import { getBranches } from '@/store/api';
import * as letterService from '@/store/Services/letterServices';
import ThemeSelector from '@/components/UiComponents/ThemeSelector.vue';

@Component({
    components: {SingleCartableOwnerMobile, ThemeSelector}
})
export default class CartableTitleMobile extends Vue{
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
    @media (min-width: 0px ) and (max-width: 414px) {
        .portrait{
            display: none !important;
        }
    }

    @media (min-width: 415px ) and (max-width: 823px) {
        .landscape{
            display: none !important;
        }
    }

    @media (min-width: 824px ) and (max-width: 14000px) {
        .largSize{
            display: none !important;
        }
    }
    #container{
        display:flex;
        justify-content:space-between;
        border-radius: 0px;
        
    }
</style>
