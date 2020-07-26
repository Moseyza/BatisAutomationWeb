<template>
    <div class="ui page dimmer trail-box">
        <div class="content">
            <div style="text-align:left;padding:5px;border-radius: 3px 3px 0 0px;" class="bg1" @click="close" ><i class="icon icon-removeFile action-icon"></i></div>
            <div class="trail-box-frame bg2" >
                <LetterTrailTree :letterId="letterPossessionId" :letterNo="letterNo"></LetterTrailTree>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import * as $ from 'jquery';
import LetterTrailTree from  '@/components/Cartable/LetterDetails/LetterTrail/LetterTrailTree.vue';
@Component({
    components:{LetterTrailTree}
})
export default class FullPageTrail extends Vue{

    
    @Prop() letterPossessionId?: string;
    @Prop() letterNo?: string;
    @Prop() isActive?: boolean;
    @Watch('isActive')
    onIsActiveChanged(nVal: boolean, oVal: boolean){
        if(nVal)
        {
            $(".trail-box").dimmer('show');
        }
        else
        {
            $(".trail-box").dimmer('hide');
        }
    }
    
    mounted(){
        $(".trail-box").dimmer({closable: false});
         if(this.isActive)
        {
            $(".trail-box").dimmer('show');
        }
        else
        {
            $(".trail-box").dimmer('hide');
        }
    }

    close(){
        this.$emit('close');
    }

 

}


</script>

<style lang="less" scoped>
.trail-box-frame{
    display: flex;
    flex-direction: column;
    border-radius: 0 0px 3px 3px;
    min-width: 800px;
    max-width: 800px;
    min-height: 500px;
    max-height: 500px;
    padding: 10px;
    overflow: auto;
    


}


</style>
