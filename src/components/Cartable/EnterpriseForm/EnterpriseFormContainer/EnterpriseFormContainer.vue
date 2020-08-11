<template>
    <div  ref="formcontainer">
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
import FormFormatRow from '@/components/Cartable/EnterpriseForm/EnterpriseFormContainer/FormFormatRow/FormFormatRow.vue';
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
    formatCells =  [] as any[];
    formatForm(){
        if(!this.form)return;
        const columnFormat = this.getColumnFormat();
        const rows =  columnFormat.split(',');
        this.formatCells = [];
        const FormFormatRowClass = Vue.extend(FormFormatRow);
        for(let i = 0; i< rows.length; i++){
            const prop = {rowIndex: i, columnCount: parseInt(rows[i])};
            const formatRowInstance = new FormFormatRowClass({propsData: prop});
            formatRowInstance.$mount();
            this.formatCells.push(formatRowInstance);
            (this.$refs.formcontainer as any).appendChild(formatRowInstance.$el);
        }
    }
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
        const col = this.getCol(index);
        const formatRowIndex = col.rowIndex;
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
            //console.log(this.formatCells[formatRowIndex].$refs[col.colName]);
            this.formatCells[formatRowIndex].$refs[col.colName][0].appendChild(instance.$el);
            //(this.$refs.formcontainer as any).appendChild(instance.$el);
        }
    }

    getCol(index: number){
        const result = {} as any;
        result.colName = "";
        result.rowIndex = 0;
        if(!this.form)return result;
        const order = index +1;
        const columnFormat = this.getColumnFormat();
        const rows =  columnFormat.split(',');
        let rowIndex = 0;
        let colIndex = 1;
        let total = 0;
        while(total < index){
            total++;
            
            if(parseInt(rows[rowIndex])=== colIndex){
                rowIndex++;
                colIndex =0;
            }
            colIndex++;
        }
        result.colName =  `col${rowIndex}${colIndex}`;
        result.rowIndex = rowIndex;
        return result;
    }

    getColumnFormat(){
        if(!this.form)return '';
        if(this.form.columnFormat != undefined && this.form.columnFormat != "")return this.form.columnFormat;
        let result = "";
        if(!this.form.bookmarks)return '';
        for(let i = 0;i<this.form.bookmarks.length; i++){
            if(this.form.bookmarks[i].isVisibleInSend)
            {
                if(result != "") result = result + ",1";
                else result = result + "1";
            }
        }
        return result;
    }
   
    async mounted(){
        console.log(this.form);
        if(this.form)
          this.formValidValues = await  enterpriseFormService.getFormValidValus(this.form.id);
        this.formatForm();
        this.drawForm();
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
        const behindCodeResultStr =  await enterpriseFormService.getCodeBehindExecutionResult(this.form.id,ownerId,parametersValue,tableParametersValue,parameterName);
        //console.log("BehindCode====>");
        const behindCodeResults =  JSON.parse(behindCodeResultStr);
        const tableParametersStr = behindCodeResults.TableParameterRows;
        if(tableParametersStr)
        {
            const tableParameters = JSON.parse(tableParametersStr);
            store.state.eventHub.$emit("tabledata-set-request",tableParameters);
        }

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