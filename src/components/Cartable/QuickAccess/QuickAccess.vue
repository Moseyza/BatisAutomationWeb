<template>
    <div class=" container2 symmetric-grid" style="justify-content:space-around">
        <div class="popup"  data-content="ارسال سریع"><i  class="action-icon icon-SendLetterFast" @click="fastSend('send')" style="font-size:30pt"></i></div>
        <div class="popup"  data-content="ارسال پیشنویس" > <i class="action-icon icon-allDraft" @click="fastSend('draft')" style="font-size:22pt"></i></div>
        <div @click="onFormsIconClicked()" id="forms-dropdown"  class="ui icon top left dropdown" data-content="فرم های اداری">
  		<i class="action-icon icon-enterpriseForm " style="font-size:17pt"></i>
        
  		<div class="left menu" >
            <div style="padding:5px" ><input type="text" v-model="formSearchTxt" style="width:100%"/></div>
            <div v-if="isLoading" class="item"><div class="ui active inline centered loader"></div></div> 
            <div style="max-height:200px !important;overflow:auto;width:300px">
                <div v-for="(form) in filteredForms" :key="form.id" class="item menu-item" :style="{'background-color':getFromColor(form.selectionColor), 'color':'black' ,'border':'1px solid black' , 'max-height':'30px','cursor':'pointer' }">
                    <div style="padding-left:5px;">{{form.name}}</div>
                </div>
            </div>
            <!-- <div id="test" class="ui icon top left dropdown">
                <i class="action-icon icon-enterpriseForm " style="font-size:17pt"></i>
    	        <div class="menu">
                    <div v-for="(form) in filteredForms" :key="form.id" class="item menu-item" :style="{'background-color':getFromColor(form.selectionColor), 'color':'black' ,'border':'1px solid black' , 'max-height':'21px' }">
                        <div style="padding-left:5px;">{{form.name}}</div>
                    </div>
                </div>
            </div> -->
  		</div>
	    </div>
    </div>
</template>

<script lang="ts">
import {Vue, Prop , Component} from 'vue-property-decorator';
import * as $ from 'jquery';
import * as enterpriseFromService from '@/store/Services/enterpriseFormService.ts';
import  store from '@/store';
import { EnterpriseForm } from '../../../store/models/EnterpriseForm/EnterpriseForm';
@Component
export default class QuickAccess extends Vue{
    enterpriseForms = [] as EnterpriseForm[];
    formSearchTxt = '';
    isFirstClickDone = false;
    ownerId = '';
    isLoading = false;
    get filteredForms(){
        return this.enterpriseForms.filter(x=>x.name.includes(this.formSearchTxt));
    }
    fastSend(mode: string){
        this.$emit('fast-send-clicked',mode);
    }
    
    mounted(){
        $('.popup').popup();
        $('#forms-dropdown').dropdown({action:'nothing'}).popup();
        $('#test').dropdown();

    }

    onFormsIconClicked(){
        
        this.ownerId =  store.state.ownerId;
        if(this.isFirstClickDone || this.ownerId === '')return
        this.isFirstClickDone = true;
        this.loadEnterpriseForms();        
    }

    getFromColor(color: number){
        if(color === 0) return '#939393';
        const result =  '#' + color.toString(16).substring(2);
        return result;
    }
    async loadEnterpriseForms()
    {
        this.isLoading = true;
        this.enterpriseForms =  await enterpriseFromService.getOwnerEnterpriseForms(this.ownerId);
        this.enterpriseForms = this.enterpriseForms.sort((x,y)=> y.selectionColor - x.selectionColor);
        this.isLoading = false;
    }


}
</script>

<style lang="less" scoped>

</style>