<template>
    <div>
        <div style="max-height:400px !important;overflow:auto;display: flex;flex-direction: column;" >
            <div id="test1" class="ui styled fluid accordion" v-for="wf in workflows" :key="wf.id"  :class="{'disabled': !showForms}"  >
                <div id="#select_all">
                    <ToggleSwitch  @checked-changed="setToAll($event,wf.enterpriseForms)" /> 
                </div>    
                <div class="title" style="width:12em;text-overflow: ellipsis;overflow:hidden;white-space: nowrap;display:flex;">
                    <div>{{wf.name}}</div>
                </div>
                <!-- <div class="left menu"> -->
                <div class="content">
                    <div class="transition hidden" v-for="item in wf.enterpriseForms" :key="item.id"   style="margin-bottom:3px">
                        <!-- <div class="popup"  :data-tooltip="item.name"></div> -->
                        <div :data-tooltip="item.name" style="display:flex;">
                            <div style="display: flex;width:12em;text-overflow: ellipsis;overflow:hidden;white-space: nowrap;margin-left: 0.5em;"> {{item.name}} </div>
                            <ToggleSwitch @checked-changed="formFilterSelection($event,item.id)" /> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ToggleSwitch from '@/components/UiComponents/ToggleSwitch.vue';
import store from '@/store';
import { Workflow } from '@/store/models/workflow/workflow';
import * as $ from 'jquery';


@Component({
    components: { ToggleSwitch}
})
export default class SingleEnterpriseSearch extends Vue {

    showForms = false;
    @Prop() workflows?: Workflow[];

    formFilterSelection(checked: boolean, formId: string) {
        store.state.eventHub.$emit("form-selection",{ isSelected: checked, formId: formId });

    }
    mounted(){
         $("#select_all").change(()=>{  //"select all" change 
            $(".checkbox").prop('checked', $(this).prop("checked")); //change all ".checkbox" checked status
        });
    }
    created(){
         $("#select_all").change(()=>{  //"select all" change 
            $(".checkbox").prop('checked', $(this).prop("checked")); //change all ".checkbox" checked status
        });
    }
    setToAll(checked: boolean,allEnterpriseForms: Array<any>){
        allEnterpriseForms.forEach(element => {
            this.formFilterSelection(checked, element.id);
        });
       
    }
}
</script>

<style lang="less" scoped>
input {
    background-color: var(--BackgroundTable);
    color: var(--FontColor);
    width: 100%;
    border: none;
    font-size: small;
    padding: 3px 3px;
}

input:focus {
    outline: none;
}

.search-icon {
    font-size: large;
}

#search-container {
    background-color: var(--BackgroundTable)
}
.active{
    color: #ff6b6b;
}
.ui.dropdown>.left.menu {
    left: 0!important;
    right: auto !important;
}
.ui.accordion{
    background:var(--BackgroundTable) !important;
    color: var(--FontColor) !important;
}
.active{
    color: var(--FontColor) !important;
}

.title.active:first-child #baseOnTime{
    -webkit-transform: rotate(360deg) !important;
    transform: rotate(360deg) !important;
}
.title.active:first-child #baseOnEtc{
    -webkit-transform: rotate(360deg) !important;
    transform: rotate(360deg) !important;
}
</style>
