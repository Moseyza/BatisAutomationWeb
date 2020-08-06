<template>
    <div class="symmetric-grid" style="margin-bottom:5px">
        <div :style="{'width':maxLabelWidthStr}">
            <span style="white-space: break-spaces;">{{persianName}}</span>
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
import * as $ from 'jquery';
import { ValidValuesForSingleTable } from '../../../../store/models/EnterpriseForm/EnterpriseFormValidValues';
import store from '@/store';
@Component
export default  class  TableBookmark extends Mixins(BookmarkMixin){
    @Prop() maxColumnLabelWidth?: number;
    @Prop() validValues?: ValidValuesForSingleTable;
    rowsCount = 0;
    created(){
        this.value = '';
    }

    addRow(){
        if(!this.bookmark)return;
        if(!this.bookmark.tableColumns)return;
        this.rowsCount++;
        this.bookmark.tableColumns.forEach(columnBookmark=>{
            if(columnBookmark && columnBookmark.isVisible){
                const columnComponent = this.getColumnBookmarkComponent(columnBookmark);
                if(columnComponent){
                    (this.$refs.tablecontainer as any).appendChild(columnComponent);
                }
            }
        })
       // $(".tc-dropdown").dropdown({action:'hide'});
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
            case 13:
                componentClass = Vue.extend(CustomQueryListBookmark);
                if(this.validValues){
                    const currentColumnValues =  this.validValues.columnsValidValues.find(c=>c.columnName === columnBookmark.englishName);
                    if(currentColumnValues)
                        props.validValues = currentColumnValues.validValues;
                }
                break;
            case 15:
                componentClass = Vue.extend(KeyboardTimeBookmark);
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
            array.push(internalObj);
        }
        obj.tableData = array;
        obj.tableName  = this.bookmark.englishName;
        store.state.eventHub.$emit('form-values-requested',obj);
        eventArg[this.bookmark.englishName] = obj.tableData;
    }
}
</script>