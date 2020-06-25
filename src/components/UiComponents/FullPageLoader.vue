<template>
    <div class="ui page dimmer fullPageLoader">
        <!-- <div class="content"> -->
            <div class="ui loader"></div>
        <!-- </div> -->
    </div>
</template>

<script lang="ts">
import {Vue,Prop,Component, Watch} from 'vue-property-decorator';
import * as $  from 'jquery';
@Component
export default class FullPageLoader extends Vue{
    @Prop() isActive?: boolean;
    @Watch('isActive')
    isActiveChanged(nVal: boolean, oVal: boolean){
        if(nVal)
            $(".fullPageLoader").dimmer('show');
        else
            $(".fullPageLoader").dimmer('hide');
    }
    mounted(){
        $('.fullPageLoader').dimmer({closable: false});
        if(this.isActive)
            $(".fullPageLoader").dimmer('show');
        else
            $(".fullPageLoader").dimmer('hide');
    }
}
</script>

<style lang="less" scoped>

</style>