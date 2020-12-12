<template>
    <div class="bg1" style="flex:1;text-align:center;display:flex;flex-direction:column;align-items:center">
        <div class="action-icon"><i @click="send()" style="color:inherit;" class="action-icon icon-sendForwardLetter xlarg-text"></i></div>
        <div id="sendingOptions-dropdown" class="ui icon top left dropdown">
            <div class="action-btn;" style="font-size: 5pt;border: 1px solid gray;padding-left: 5px;margin-left: 5px;width: 20px;height: 10px;box-sizing: border-box;    background-color: lightgray;">
                <i style="margin-top:-10px" class="icon action-icon icon-triangle"></i>
            </div>
            <div class="menu">
                <div class="item menu-item">
                    <div style="text-align:right;display:flex;flex-direction:column">
                        <div> 
                            
                             <ToggleSwitch  :checkedProp="signProp" @checked-changed="optionsChanged('sign',$event)" />
                             <label style="margin-right:5px">امضا</label>
                        </div>
                        <div style="margin-top:5px">
                            <ToggleSwitch  :checkedProp="setCopyProp" @checked-changed="optionsChanged('setCopy',$event)" /> 
                            <label style="margin-right:5px" >تنظیم گیرنگان رونوشت</label>
                             
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import ToggleSwitch from '@/components/UiComponents/ToggleSwitch.vue';
import * as $ from 'jquery';
@Component({components: {ToggleSwitch} })
export default class SendButtonWithOptionsMobile extends Vue {
    @Prop() signProp?: boolean;
    @Prop() setCopyProp?: boolean;
    sign = false;
    setCopy = false;
    mounted(){
        $('#sendingOptions-dropdown').dropdown({action:'nothing'});
    }
    updated(){
         $('#sendingOptions-dropdown').dropdown({action:'nothing'});
    }

    optionsChanged(option: string, checked: boolean){
        if(option == 'sign')
            this.sign = checked;
        if(option == 'setCopy')
            this.setCopy = checked;
        const options = {sign: this.sign , setCopy: this.setCopy};
        this.$emit("options-changed",options);
    }

    send(){
        this.$emit('send');
    }
}
</script>