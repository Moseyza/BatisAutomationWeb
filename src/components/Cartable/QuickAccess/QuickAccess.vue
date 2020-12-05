<template>
    <div class=" container2 symmetric-grid" style="justify-content:space-around">
        <div class="popup"  data-content="ارسال سریع"><i  class="action-icon icon-SendLetterFast" @click="fastSend('send')" style="font-size:30pt"></i></div>
        <div class="popup"  data-content="ارسال پیشنویس" > <i class="action-icon icon-allDraft" @click="fastSend('draft')" style="font-size:22pt"></i></div>
        <div @click="onFormsIconClicked()" id="forms-dropdown"  class="ui icon top left dropdown" data-content="فرم های اداری">
  		<i class="action-icon icon-enterpriseForm " style="font-size:17pt"></i>
        
  		<div class="left menu" >
            <div style="padding:5px" ><input type="text" v-model="formSearchTxt" style="width:100%"/></div>
            <div v-if="isLoading" class="item"><div class="ui active inline centered loader"></div></div> 
            <div style="max-height:200px !important;overflow:auto;width:300px;background:var(--BackgroundTable1);">
                <div v-for="(form) in filteredForms" :key="form.id" class="item menu-item" :style="{'background-color':getFromColor(form.selectionColor), 'color':'black' ,'border':'1px solid black' , 'max-height':'30px','cursor':'pointer' , 'overflow':'hidden' }">
                    <div @click="showForm(form.id)" style="padding-left:5px;">{{form.name}}</div>
                </div>
            </div>
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
import { EnterpriseFormTableBookmarkColumn } from '@/store/models/EnterpriseForm/EnterpriseFormTableBookmarkColumn';
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
        if(color === 0) return 'var(--BackgroundTable1)';
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

    async showForm(id: string){
        this.ownerId = store.state.ownerId;
        const selectedForm =  this.enterpriseForms.find(x=>x.id === id);
        if(!selectedForm) return;
        if(!selectedForm.bookmarks)return;
        for(let i=0;i< selectedForm.bookmarks.length;i++) {
            if(selectedForm.bookmarks[i].tableColumns!= null && selectedForm.bookmarks[i].tableColumns!= undefined){
                // if(selectedForm.bookmarks[i].tableColumns.length > 0)
                // {
                //     for(let j = 0;j<selectedForm.bookmarks[i].tableColumns.length;j++)
                //     {
                //         await this.updatePrams(selectedForm.bookmarks[i].tableColumns[j]);
                //     }
                // }
            }
        }
        
        this.$emit('enterprise-form-selected',selectedForm);
    }

    async updatePrams(col: EnterpriseFormTableBookmarkColumn){
        if(!col)return;
        if(col.defaultValue){
                            if(col.defaultValue.includes("%%")){
                                 const updatedValue = await enterpriseFromService.updateParameter(this.ownerId,col.defaultValue);
                                 col.defaultValue = updatedValue;
                                 alert(updatedValue);
                            }
                        }
    }



}
</script>

<style lang="less" scoped>

</style>