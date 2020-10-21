<template>
    <div class="three-part-flexbox" id="main-container">
        This is Mobile view
    </div>
</template>

<script lang="ts">
import MixinMainWindow from '@/components/Cartable/ComponentMixins/MixinMainWindow';
import {Component, Mixins} from 'vue-property-decorator'


@Component
export default class MainWindowMobile extends Mixins(MixinMainWindow) {
   
}

</script>

<style lang="less" scoped>
#main-container{
    display:flex;
    flex-direction:column;
    //height:-webkit-fill-available;
}

#child-container{
    display: flex;
    flex-direction: row;
    max-height:-webkit-fill-available;
    //overflow:auto;
    //height:100%;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .8s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>


