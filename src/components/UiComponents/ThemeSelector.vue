<template>
    <div style="display:flex;justify-content:center;align-items:center;">
        <div style="flex:1">
            <ToggleSwitch style="margin-left:3px" @checked-changed="onCheckChanged($event)" :isReadOnly="false"/>
        </div>
        <div style="flex:1">
            <i class="icon-sumoon" style="font-size:2em"></i>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component , Prop} from 'vue-property-decorator'
import ToggleSwitch from './ToggleSwitch.vue';

@Component({components: {ToggleSwitch}})
export default class ThemeSelector extends Vue {
    onCheckChanged(checked: boolean){
        if(checked)
            this.changeColor();
        else
            this.reset();
    }

     changeColor(){
        const element= document.documentElement
        element.style.setProperty('--LineItem','#949494');
        element.style.setProperty('--BackgroundTable','#cacaca');
        element.style.setProperty('--SingleLetter','#f6f6f6');
        element.style.setProperty('--DetailBackground','#eaeaea');
        element.style.setProperty('--NormalBackground','#cacaca');
        element.style.setProperty('--TxtColor','#3f3f3f');
        element.style.setProperty('--FontColor','#3f3f3f');
    } 
     reset(){
        const element= document.documentElement
        element.style.setProperty('--LineItem','#5f5f5f');
        element.style.setProperty('--BackgroundTable','#575757');
        element.style.setProperty('--SingleLetter','#4d4d4d');
        element.style.setProperty('--DetailBackground','#494949');
        element.style.setProperty('--NormalBackground','#3f3f3f');
        element.style.setProperty('--TxtColor','#e7e7e7');
        element.style.setProperty('--FontColor','#e7e7e7');
    }
}

</script>

