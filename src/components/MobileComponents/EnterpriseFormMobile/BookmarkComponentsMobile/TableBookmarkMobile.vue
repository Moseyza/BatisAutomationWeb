<template>
    <div class="symmetric-grid" style="margin-bottom:5px">
        <!-- <div :style="{'width':maxLabelWidthStr}">
            <span style="white-space: break-spaces;">{{persianName}}</span>
            <span v-if="isMandatory" style="color:red;">*</span>
            <span style="float:left">:</span>
        </div> -->
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
import { EnterpriseFormTableBookmarkColumn } from '../../../../store/models/EnterpriseForm/EnterpriseFormTableBookmarkColumn';
import IntegerBookmarkMobile from './IntegerBookmarkMobile.vue';
import StringBookmarkMobile from './StringBookmarkMobile.vue';
import KeyboardTimeBookmarkMobile from './KeyboardTimeBookmarkMobile.vue';
import UserCreatedListBookmarkMobile from './UserCreatedListBookmarkMobile.vue';
import CustomQueryListBookmarkMobile from './CustomQueryListBookmarkMobile.vue';
import CompanyListBookmarkMobile from './CompanyListBookmarkMobile.vue';
import DynamicListBookmarkMobile from './DynamicListBookmarkMobile.vue';
import FileBookmarkMobile from './FileBookmarkMobile.vue';
import CurrencyBookmarkMobile from './CurrencyBookmarkMobile.vue';
import TableRowContainerMobile from '@/components/MobileComponents/EnterpriseFormMobile/EnterpriseFormContainerMobile/TableRowContainerMobile.vue';
import * as $ from 'jquery';
import { ValidValuesForSingleTable } from '../../../../store/models/EnterpriseForm/EnterpriseFormValidValues';
import FormFormatRowMobile from '@/components/MobileComponents/EnterpriseFormMobile/EnterpriseFormContainerMobile/FormFormatRowMobile/FormFormatRowMobile.vue';
import store from '@/store';
import BooleanBookmarkMobile from './BooleanBookmarkMobile.vue';
import DataBookmarkMobile from './DateBookmarkMobile.vue';
import FloatBookmarkMobile from './FloatBookmarkMobile.vue';
import BookmarkMixin from '@/components/Cartable/EnterpriseForm/BookmarkComponents/BookmarkMixin';
@Component
export default  class  TableBookmarkMobile extends Mixins(BookmarkMixin){
    @Prop() maxColumnLabelWidth?: number;
    @Prop() validValues?: ValidValuesForSingleTable;
    invisibleColumns = [] as EnterpriseFormTableBookmarkColumn[];
    invisibleValues = [] as any[];
    
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
        store.state.eventHub.$on("tabledata-set-request",(e: any,t: boolean)=> this.onTableDataSet(e,t));
        store.state.eventHub.$on("tablerow-add-requested",this.onTableRowAddRequested);
    }
    formatCells =  [] as any[];
    formatRow(rowContainerInstance: any){
        if(!this.bookmark)return;
        //if(!this.bookmark.columnFormat)return;
        const columnFormat = this.getColumnFormat();
       // alert(columnFormat);
        const rows =  columnFormat.split(',');
        this.formatCells = [];
        const FormFormatRowClass = Vue.extend(FormFormatRowMobile);
        for(let i = 0; i< rows.length; i++){
            const prop = {rowIndex: i, columnCount: parseInt(rows[i])};
            const formatRowInstance = new FormFormatRowClass({propsData: prop});
            formatRowInstance.$mount();
            this.formatCells.push(formatRowInstance);
            (rowContainerInstance.$refs.tablerow as any).appendChild(formatRowInstance.$el);
        }
    }
    rows =  [] as TableRowContainerMobile[];
    addRow(){
        if(!this.bookmark)return;
        if(!this.bookmark.tableColumns)return;
        this.rowsCount++;
        const rowContainerClass = Vue.extend(TableRowContainerMobile);
        const rowContainerInstance = new rowContainerClass({propsData: {rowIndex:this.rowsCount-1,tableName: this.englishName} });
        this.rows.push(rowContainerInstance as TableRowContainerMobile);
        rowContainerInstance.$mount();
        this.formatRow(rowContainerInstance);
        let visibleIndex = 0;
        this.bookmark.tableColumns.forEach((columnBookmark,index)=>{
            if(columnBookmark && columnBookmark.isVisible){
                const col = this.getCol(visibleIndex);
                visibleIndex++
                const formatRowIndex = col.rowIndex;
                const columnComponent = this.getColumnBookmarkComponent(columnBookmark);
                if(columnComponent){
                    if(this.formatCells[formatRowIndex])
                        this.formatCells[formatRowIndex].$refs[col.colName][0].appendChild(columnComponent);
                }
            }
        });
        if((this.$refs.tablecontainer as any))
            (this.$refs.tablecontainer as any).appendChild(rowContainerInstance.$el);
        this.$emit("value-changed",this.englishName);
    }
    onTableRowAddRequested(info: any){
        if(info.tableName != this.englishName)return;
        for(let i=0;i<info.rowCount;i++){
            this.addRow();
        }
    }
    
    getColumnBookmarkComponent(columnBookmark: EnterpriseFormTableBookmarkColumn){
        let componentClass = undefined;
        const props = {} as any;
        props.tableColumnBookmark = columnBookmark;
        props.parentTableName = this.englishName;
        props.tableRowIndex = this.rowsCount -1;
        switch(columnBookmark.type){
            case 0:
                componentClass = Vue.extend(IntegerBookmarkMobile);
                break;
            case 1:
                componentClass = Vue.extend(StringBookmarkMobile);
                break;
            case 2:
                componentClass = Vue.extend(BooleanBookmarkMobile);
                break;
            case 3:
                componentClass = Vue.extend(FloatBookmarkMobile);
                break;
            case 4: 
                componentClass = Vue.extend(CurrencyBookmarkMobile);
                break;
            case 5: 
                componentClass = Vue.extend(DataBookmarkMobile);
                break;
            case 7:
                componentClass = Vue.extend(UserCreatedListBookmarkMobile);
                break;
            case 10:
                componentClass = Vue.extend(CompanyListBookmarkMobile);
                break;
            case 13:
                componentClass = Vue.extend(CustomQueryListBookmarkMobile);
                if(this.validValues){
                    const currentColumnValues =  this.validValues.columnsValidValues.find(c=>c.columnName === columnBookmark.englishName);
                    if(currentColumnValues)
                        props.validValues = currentColumnValues.validValues;
                }
                break;
            case 14://dynamicList
                componentClass = Vue.extend(DynamicListBookmarkMobile);
                break;
            case 15:
                componentClass = Vue.extend(KeyboardTimeBookmarkMobile);
                break;
            case 16:
                componentClass = Vue.extend(FileBookmarkMobile);
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
                else{
                    if(this.getColumnType(ic.englishName) === 2)//invisible column is of type boolean
                        internalObj[ic.englishName] = false;
                    // else if(this.getColumnType(ic.englishName) === 13)//invisible column is of type custom query
                    //     internalObj[ic.englishName] = {Id:"",Value:""};
                    else if(this.getColumnType(ic.englishName) === 16)//invisible column is of type file
                        internalObj[ic.englishName] = {Name:"",Id:"00000000-0000-0000-0000-000000000000"};
                    else if(this.getColumnType(ic.englishName)===0 || this.getColumnType(ic.englishName)===3 || this.getColumnType(ic.englishName)===4) //int or float or currency
                        internalObj[ic.englishName] = 0;
                    else
                    internalObj[ic.englishName] = "";
                }
                    
            });

            array.push(internalObj);
        }
        obj.tableData = array;
        obj.tableName  = this.bookmark.englishName;
        store.state.eventHub.$emit('form-values-requested',obj);
        eventArg[this.bookmark.englishName] = obj.tableData;
    }

    onTableDataSet(tablesData: any, isFromBehindCode: boolean){
       
        
        if(!this.bookmark)return;
        const data = tablesData[this.bookmark.englishName];
        if(!data)return;
        if(data.length != this.rowsCount)
        {
            const info = {} as any;
            const rowCount =   data.length - this.rowsCount;
            info.rowCount = rowCount;
            info.tableName = this.englishName;
            if(rowCount >0){
                this.onTableRowAddRequested(info);
            }
            else if(rowCount < 0){
                const abs = Math.abs(rowCount);
                for(let i = 0; i< abs; i++){
                    if(this.rows[this.rows.length -1]){
                        this.rows[this.rows.length -1].removeRow();
                        this.rows.pop();
                    }
                }
            }
            //alert("test");
        }
        this.setData(data,isFromBehindCode)
    }

    setData(tableData: any[],isFromBehindCode: boolean){
        this.invisibleValues = [];
        tableData.forEach((row,index) => {
            const rowData = {} as any;
            rowData.rowIndex = index;
            rowData.data = row;
            rowData.tableName = this.englishName;
            const obj = {} as any;
            this.invisibleColumns.forEach(ic=>{
                obj[ic.englishName] = row[ic.englishName]; 
            });
            this.invisibleValues.push(obj);
            store.state.eventHub.$emit("tablerow-set-requested",rowData,isFromBehindCode);
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
        if(!this.bookmark.tableColumns)return '';
        if(this.bookmark.columnFormat != undefined && this.bookmark.columnFormat != ""){
            const visibleBookmarks =  this.bookmark.tableColumns.filter(bm=>bm.isVisible); 
            const splited =  this.bookmark.columnFormat.split(',');
            let columnFormatSum = 0;
            splited.forEach(x=>{ columnFormatSum += parseInt(x)});
            if(visibleBookmarks.length > columnFormatSum)
            {
                const diff = visibleBookmarks.length - columnFormatSum;
                let result = this.bookmark.columnFormat;
                for(let i =0; i < diff;i++)
                {
                    result += ',1'; 
                }
                return result;
            }
            else{

                return this.bookmark.columnFormat;
            }
        }
        let result = "";
        
        for(let i = 0;i<this.bookmark.tableColumns.length; i++){
            if(this.bookmark.tableColumns[i].isVisible)
            {
                if(result != "") result = result + ",1";
                else result = result + "1";
            }
        }
        return result;



        
    }

    onTableRowRemoved(rowInfo: any){
        if(this.englishName !== rowInfo.tableName)return;
        if(!this.invisibleValues)return;
        if(this.invisibleValues.length > 0){
            this.invisibleValues =  this.invisibleValues.splice(rowInfo.rowIndex,1);
            
        }
        //این باید فعال شود فعلا در جای دیگری پاپ کردم ولی باید اینجا باشد
        //this.rows =  this.rows.splice(rowInfo.rowIndex,1);
        this.rowsCount--;
    }

    beforeDestroy(){
        store.state.eventHub.$off("tablerow-add-requested",this.onTableRowAddRequested);
    }
    getColumnType(columnName: string){
        if(!this.bookmark)return 1;
        if(!this.bookmark.tableColumns)return 1;
        const column =  this.bookmark.tableColumns.find(x=>x.englishName === columnName);
        if(column)
            return column.type;
        return 1;
    }
}
</script>