<template>
<div>
    <div  ref="formcontainer">
    </div>
    <button @click="test">test</button>
    </div>
</template>

<script lang="ts">
import {Vue,Component,Prop} from 'vue-property-decorator';
import StringBookmark from '@/components/Cartable/EnterpriseForm/BookmarkComponents/StringBookmark.vue';
import DateBookmark from '@/components/Cartable/EnterpriseForm/BookmarkComponents/DateBookmark.vue';
import FileBookmark from '@/components/Cartable/EnterpriseForm/BookmarkComponents/FileBookmark.vue';
import TableBookmark from '@/components/Cartable/EnterpriseForm/BookmarkComponents/TableBookmark.vue';
import {EnterpriseForm} from '@/store/models/EnterpriseForm/EnterpriseForm';
import { EnterpriseFormBookmark } from '@/store/models/EnterpriseForm/EnterpriseFormBookmark';
import * as enterpriseFormService from '@/store/Services/enterpriseFormService';
import * as $ from 'jquery';
import { EnterpriseFormValidValues } from '../../../../store/models/EnterpriseForm/EnterpriseFormValidValues';
import store from '@/store';
@Component
export default class EnterpriseFormContainer extends Vue{
    maxLabelLength = 0;
    currentLabel = '';
    formValidValues = {} as  EnterpriseFormValidValues;
    invisibleBookmarks = [] as any[];
    @Prop() form?: EnterpriseForm;
    @Prop() tableLblWidth?: number;
    @Prop() formLblWidth?: number;

    drawForm(){
        if(!this.form)return;
        if(!this.form.bookmarks)return;
        this.invisibleBookmarks.length = 0;
        this.form.bookmarks.forEach((bookmark,index) => {
            if(bookmark.isVisibleInSend)
                this.addBookmarkToForm(bookmark,index);    
            else 
                this.addToInvisibleBookmarks(bookmark);
        });
    }
    addToInvisibleBookmarks(bookmark: EnterpriseFormBookmark){
        const invisibleItem = {} as any;
        invisibleItem.Name = bookmark.englishName;
        invisibleItem.Id = bookmark.id;
        invisibleItem.Value = bookmark.defaultValue;
        this.invisibleBookmarks.push(invisibleItem);
    }
    addBookmarkToForm(bookmark: EnterpriseFormBookmark, index: number){
        let componentClass = undefined;
        //alert(bookmark.type);
        switch(bookmark.type)
        {
            case 0://string
                componentClass = Vue.extend(StringBookmark);
                break;
            case 1://int
                componentClass = Vue.extend(StringBookmark);
                break;
            case 2://float
                componentClass = Vue.extend(StringBookmark);
                break;
            case 3://date
                componentClass = Vue.extend(DateBookmark);
                break;
            case 9://shortString
                componentClass = Vue.extend(StringBookmark);
                break;
            case 13://file
                componentClass = Vue.extend(FileBookmark);
                break;
            case 18://table
                componentClass = Vue.extend(TableBookmark);
                break;
        }
        if(componentClass){
            const props = {} as any; 
            props.bookmark = bookmark;
            props.maxLabelWidth = this.formLblWidth;
            if(bookmark.type === 18){
                props.maxColumnLabelWidth = this.tableLblWidth;
                if(this.formValidValues.tableValidValues)
                {
                       const currentTableValues =  this.formValidValues.tableValidValues.find(item=>item.tableName === bookmark.englishName);
                       if(currentTableValues)
                            props.validValues = currentTableValues;
                }
            }
            const instance = new componentClass({propsData: props});
            instance.$on("value-changed",(e: string)=>{this.onFormParameterChanged(e)});
            instance.$mount();
            (this.$refs.formcontainer as any).appendChild(instance.$el);
        }
    }
   
    async mounted(){
        console.log(this.form);
        if(this.form)
          this.formValidValues = await  enterpriseFormService.getFormValidValus(this.form.id);
        this.drawForm();
    }

    test(){
        const obj  = {} as any;
        obj.tableName  = '';
        store.state.eventHub.$emit('form-values-requested',obj);
        console.log(obj);
    }
    getFormData(){
        const formData  = {} as any;
        formData.tableName  = '';
        store.state.eventHub.$emit('form-values-requested',formData);
        return formData;
    }
    getFormTableNames(){
        if(!this.form)return [];
        if(!this.form.bookmarks) return [];
        const tableNames =  [] as string[];
        this.form.bookmarks.forEach(bm => {
            if(bm.type === 18)//if bookmark is table
                tableNames.push(bm.englishName);
        }); 
        return tableNames;
    }
    async onFormParameterChanged(parameterName: string){
        if(!this.form)return;
        const tableNames = this.getFormTableNames();
        const formData = this.getFormData();
        const formParameters = [] as any[];
        
        for(const key in formData){
            if(key!='tableName' && !tableNames.includes(key)){
                formParameters.push(formData[key]);
            }
        }

        //adding invisible values
        this.invisibleBookmarks.forEach(invisibleItem=>{
            formParameters.push(invisibleItem);
        });

        const tablesData = {} as any;
        tableNames.forEach(tn=>tablesData[tn] = formData[tn]);
        const ownerId =  store.state.ownerId;
        const parametersValue =  JSON.stringify(formParameters);
        const tableParametersValue = JSON.stringify(tablesData);
        await enterpriseFormService.getCodeBehindExecutionResult(this.form.id,ownerId,parametersValue,tableParametersValue,parameterName);

    }
    
}
</script>

<style lang="less" scoped>
    #text-meter{
        position: absolute;
        //visibility: hidden;
        height: auto;
        width: auto;
        white-space: nowrap;
    }
</style>