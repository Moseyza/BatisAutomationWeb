<template>
    <div class="symmetric-grid" style="margin-bottom:5px">
        <div :style="{'width':maxLabelWidthStr}">
            <span style="white-space: break-spaces;">{{persianName}}</span>
            <span v-if="isMandatory" style="color:red;">*</span>
            <span style="float:left">:</span>
        </div>
        <div style="flex:1;padding:0 5px;">
            <div  ref="tablecontainer" style="border:1px solid black; min-height:5px">
            </div>
            <div style="text-align:left">
                <button @click="addRow()" class="button"><i class="icon-plus"></i></button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue,Component,Prop, Watch,Mixins} from 'vue-property-decorator';
import BookmarkMixin from './BookmarkMixin';
import { EnterpriseFormTableBookmarkColumn } from '../../../../store/models/EnterpriseForm/EnterpriseFormTableBookmarkColumn';
import IntegerBookmark from './IntegerBookmark.vue';
import StringBookmark from './StringBookmark.vue';
import KeyboardTimeBookmark from './KeyboardTimeBookmark.vue';
import UserCreatedListBookmark from './UserCreatedListBookmark.vue';
import CustomQueryListBookmark from './CustomQueryListBookmark.vue';
import CompanyListBookmark from './CompanyListBookmark.vue';
import DynamicListBookmark from './DynamicListBookmark.vue';
import FileBookmark from './FileBookmark.vue';
import TableRowContainer from '@/components/Cartable/EnterpriseForm/EnterpriseFormContainer/TableRowContainer.vue';
import * as $ from 'jquery';
import { ValidValuesForSingleTable } from '../../../../store/models/EnterpriseForm/EnterpriseFormValidValues';
import FormFormatRow from '@/components/Cartable/EnterpriseForm/EnterpriseFormContainer/FormFormatRow/FormFormatRow.vue';
import store from '@/store';
@Component
export default  class  TableBookmark extends Mixins(BookmarkMixin){
    @Prop() maxColumnLabelWidth?: number;
    @Prop() validValues?: ValidValuesForSingleTable;
    invisibleColumns = [] as EnterpriseFormTableBookmarkColumn[];
    invisibleValues = [] as any[];
    rowsCount = 0;
    created(){
        this.value = '';
        if(!this.bookmark)return;
        if(!this.bookmark.tableColumns)return;
        this.invisibleColumns = [];
        this.invisibleValues = [];
        this.bookmark.tableColumns.forEach(x=>{
            if(x && !x.isVisible)
                this.invisibleColumns.push(x);
        });
        store.state.eventHub.$on("tabledata-set-request",(e: any)=> this.onTableDataSet(e));
        
    }
    formatCells =  [] as any[];
    formatRow(rowContainerInstance: any){
        if(!this.bookmark)return;
        //if(!this.bookmark.columnFormat)return;
        const columnFormat = this.getColumnFormat();
        const rows =  columnFormat.split(',');
        this.formatCells = [];
        const FormFormatRowClass = Vue.extend(FormFormatRow);
        for(let i = 0; i< rows.length; i++){
            const prop = {rowIndex: i, columnCount: parseInt(rows[i])};
            const formatRowInstance = new FormFormatRowClass({propsData: prop});
            formatRowInstance.$mount();
            this.formatCells.push(formatRowInstance);
            (rowContainerInstance.$refs.tablerow as any).appendChild(formatRowInstance.$el);
        }
    }
    addRow(){
        if(!this.bookmark)return;
        if(!this.bookmark.tableColumns)return;
        this.rowsCount++;
        const rowContainerClass = Vue.extend(TableRowContainer);
        const rowContainerInstance = new rowContainerClass({propsData: {rowIndex:this.rowsCount-1} });
        rowContainerInstance.$mount();
        this.formatRow(rowContainerInstance);
        this.bookmark.tableColumns.forEach((columnBookmark,index)=>{
        const col = this.getCol(index);
        const formatRowIndex = col.rowIndex;
            if(columnBookmark && columnBookmark.isVisible){
                const columnComponent = this.getColumnBookmarkComponent(columnBookmark);
                if(columnComponent){
                    this.formatCells[formatRowIndex].$refs[col.colName][0].appendChild(columnComponent);
                }
            }
        });
        (this.$refs.tablecontainer as any).appendChild(rowContainerInstance.$el);
        this.$emit("value-changed",this.englishName);
    }
    
    getColumnBookmarkComponent(columnBookmark: EnterpriseFormTableBookmarkColumn){
        let componentClass = undefined;
        const props = {} as any;
        props.tableColumnBookmark = columnBookmark;
        if(this.bookmark)
            props.parentTableName = this.bookmark.englishName;
        props.tableRowIndex = this.rowsCount -1;
        switch(columnBookmark.type){
            case 0:
                componentClass = Vue.extend(IntegerBookmark);
                break;
            case 1:
                componentClass = Vue.extend(StringBookmark);
                break;
            case 7:
                componentClass = Vue.extend(UserCreatedListBookmark);
                break;
            case 10:
                componentClass = Vue.extend(CompanyListBookmark);
                break;
            case 13:
                componentClass = Vue.extend(CustomQueryListBookmark);
                if(this.validValues){
                    const currentColumnValues =  this.validValues.columnsValidValues.find(c=>c.columnName === columnBookmark.englishName);
                    if(currentColumnValues)
                        props.validValues = currentColumnValues.validValues;
                }
                break;
            case 14://dynamicList
                componentClass = Vue.extend(DynamicListBookmark);
                break;
            case 15:
                componentClass = Vue.extend(KeyboardTimeBookmark);
                break;
            case 16:
                componentClass = Vue.extend(FileBookmark);
                break;
        }
        if(componentClass){
            if(this.maxColumnLabelWidth)
                props.maxLabelWidth = this.maxColumnLabelWidth;
            const instance = new componentClass({propsData: props});
            instance.$on("value-changed",(e: any)=>{this.$emit("value-changed",this.englishName)});
            instance.$mount();
            return instance.$el;
        }
        return undefined;
    }
    getData(eventArg: any){
        if(eventArg.tableName !='')return;//answer only requests from form.prevent recursive calls
        if(!this.bookmark)return;
        const obj = {} as any;
        const array  = [] as any;
        for(let i =0; i<this.rowsCount;i++)
        {
            const internalObj = {} as any;
            this.invisibleColumns.forEach(ic=>{
                if(this.invisibleValues.length > i)
                    internalObj[ic.englishName] = this.invisibleValues[i][ic.englishName];
                else
                    internalObj[ic.englishName] = "";
            });

            array.push(internalObj);
        }
        obj.tableData = array;
        obj.tableName  = this.bookmark.englishName;
        store.state.eventHub.$emit('form-values-requested',obj);
        eventArg[this.bookmark.englishName] = obj.tableData;
    }

    onTableDataSet(tablesData: any){
        if(!this.bookmark)return;
        const data = tablesData[this.bookmark.englishName];
        if(!data)return;
        this.setData(data)
    }

    setData(tableData: any[]){
        this.invisibleValues = [];
        tableData.forEach((row,index) => {
            const rowData = {} as any;
            rowData.rowIndex = index;
            rowData.data = row;
            const obj = {} as any;
            this.invisibleColumns.forEach(ic=>{
                obj[ic.englishName] = row[ic.englishName]; 
            });
            this.invisibleValues.push(obj);
            store.state.eventHub.$emit("tablerow-set-requested",rowData);
        });
    }

    getCol(index: number){
        const result = {} as any;
        result.colName = "";
        result.rowIndex = 0;
        if(!this.bookmark)return result;
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
        if(!this.bookmark)return '';
        if(this.bookmark.columnFormat != undefined && this.bookmark.columnFormat != "")return this.bookmark.columnFormat;
        let result = "";
        if(!this.bookmark.tableColumns)return '';
        for(let i = 0;i<this.bookmark.tableColumns.length; i++){
            if(this.bookmark.tableColumns[i].isVisible)
            {
                if(result != "") result = result + ",1";
                else result = result + "1";
            }
        }
        return result;
        
    }
}
</script>