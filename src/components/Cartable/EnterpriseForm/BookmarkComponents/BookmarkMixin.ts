import {Component,Vue, Prop, Watch} from 'vue-property-decorator'
import { EnterpriseFormBookmark } from '@/store/models/EnterpriseForm/EnterpriseFormBookmark';
import { EnterpriseFormTableBookmarkColumn } from '@/store/models/EnterpriseForm/EnterpriseFormTableBookmarkColumn';
import store from '@/store';
import File from '@/store/models/Letter/File';

@Component
export default class BookmarkMixin extends Vue{
    @Prop() bookmark?: EnterpriseFormBookmark;
    @Prop() tableColumnBookmark?: EnterpriseFormTableBookmarkColumn;
    @Prop() maxLabelWidth?: number;
    @Prop() parentTableName?: string;
    @Prop() tableRowIndex?: number;
    rowsCount = 0;//only for table bookmark
    value: any = {};
    valueId = '';
    @Watch('value')
    onValueChanged(newVal: any, oldVal: any){
        //this must be empty
    }

    get persianName(){
        if(this.bookmark)return this.bookmark.persianName;
        else if(this.tableColumnBookmark) return this.tableColumnBookmark.persianName;
        else return '';
    }
    
    get englishName(){
        if(this.bookmark)return this.bookmark.englishName;
        else if(this.tableColumnBookmark) return this.tableColumnBookmark.englishName;
        else return '';
    }

    get isReadOnly(){
        if(this.bookmark)return this.bookmark.isReadOnly;
        else if(this.tableColumnBookmark) return this.tableColumnBookmark.isReadonly;
        else return false;
    }

    get columnColor(){
        if(this.tableColumnBookmark) return '#' + this.tableColumnBookmark.color.toString(16).substring(2);
    }

    get maxLabelWidthStr(){
        if(this.maxLabelWidth)
            return (this.maxLabelWidth + 25).toString() + 'px'
        return '';
    }

    get defaultValue(){ //این باید اصلاح شود احتمالا
        if(this.bookmark)
            return this.bookmark.defaultValue;
        if(this.tableColumnBookmark)
            return this.tableColumnBookmark.defaultValue;
        return '';
    }

    get isMandatory(){
        if(this.bookmark)
            return this.bookmark.isMandatory;
        else if(this.tableColumnBookmark)
            return this.tableColumnBookmark.isMandatory;
    }

    get isMandatoryValueSupplied(){
        if(!this.isMandatory)return true;
        if(this.bookmark){
            if(this.bookmark.type === 18){
                if(this.rowsCount === 0){ return false;}
                else return true;
            }
        }
        let result = this.value !=='' && this.value !== ({} as any) && this.value !== undefined;
        if(this.value.Id !== undefined && this.value.Value !== undefined){
            result = result && (this.value.Value !== "" && this.value.Id !== "");
        }
        //if(!result)alert(this.englishName);
        return result;

    }

    onMandatoryValueValidation(e: any){
        const isSupplied = this.isMandatoryValueSupplied;
        e.allValuesSupplied = e.allValuesSupplied && isSupplied;
        if(!isSupplied) 
        {
            let errorMsg = this.persianName;
            if(this.tableRowIndex != undefined) errorMsg = errorMsg + " سطر: " + (this.tableRowIndex+1) 
            e.errors.push(errorMsg);
        }
        
    }
    onTableRowRemoved(rowInfo: any){
        if(this.tableRowIndex === undefined || !this.parentTableName)return;
        if(this.parentTableName === rowInfo.tableName && this.tableRowIndex === rowInfo.rowIndex)
        {
            this.$destroy();
            this.$el.remove();
        }
    }
    onAddFileRequested(attachedFiles: any[]){
        const file = this.value as File;
        const attachedFile = {} as any;
        attachedFile.fileId = file.id;
        attachedFile.fileContent = file.content;
        attachedFile.fileName = file.extension;
        if(this.tableRowIndex !== undefined && this.parentTableName)
            attachedFile.bookmarkName = this.parentTableName + "|" + this.englishName + "|" + this.tableRowIndex + "|" + file.id + "|" + file.extension;
        else
            attachedFile.bookmarkName = this.englishName + "|" + file.id + "|" + file.extension;
        attachedFiles.push(attachedFile);
    }
    created(){
        // if(this.tableColumnBookmark){
        //     if(this.tableColumnBookmark.type === 10)
        //         alert("created");
            
        // }
        // if(this.bookmark)
        //     if(this.bookmark.type === 3)
        //             alert("Date");
        store.state.eventHub.$on("test-sayname", this.sayName);
        store.state.eventHub.$on("form-values-requested", this.getData);
        store.state.eventHub.$on("tablerow-set-requested", this.setValueInTableRow);
        store.state.eventHub.$on("newvalues-set-request",this.setNewValues);
        store.state.eventHub.$on("mandatory-values-validation", this.onMandatoryValueValidation );
        store.state.eventHub.$on("table-row-removed",this.onTableRowRemoved);
        if((this.bookmark && this.bookmark.type === 13) || (this.tableColumnBookmark && this.tableColumnBookmark.type === 16))
        store.state.eventHub.$on("add-file-requested",this.onAddFileRequested);
         store.state.eventHub.$on("remove-all",(e: any)=>{
             this.$destroy();
             this.$el.remove();
         } );
         
    }

    sayName(){
        alert(this.englishName)
    }
    
    getData(eventArg: any){
        if((eventArg.tableName === ''  && !this.parentTableName) || (eventArg.tableName === this.parentTableName)){
            const data  = {} as any;
            if(eventArg.tableName === ''){
                if(!this.bookmark)return;
                data.Id = this.bookmark.id;
                data.Name = this.bookmark.englishName;
                if(this.bookmark.type === 13){//file bookmark
                    data.Value = this.value.id;
                }
                if(this.bookmark.type === 15){//company bookmark
                    data.Value = this.value.Id
                }
                else{
                    if(this.value.Value)
                        data.Value = this.value.Value;
                    else
                        data.Value = this.value;
                }
                eventArg[this.bookmark.englishName] = data;
            }
            else{
                if(!this.tableColumnBookmark)return;
                if(this.tableRowIndex === undefined)return;
                if(eventArg.tableData)
                    if(eventArg.tableData[this.tableRowIndex])
                        if(this.tableColumnBookmark.type === 16)//column bookmark is a file
                        {
                            if(this.value.id)
                                eventArg.tableData[this.tableRowIndex][this.tableColumnBookmark.englishName] = {Id: this.value.id,Name:this.value.extension}    
                            else
                                eventArg.tableData[this.tableRowIndex][this.tableColumnBookmark.englishName] = {Id: "00000000-0000-0000-0000-000000000000",Name:""}    
                        }
                        else{
                        //if(this.value === undefined)this.value = '';
                            eventArg.tableData[this.tableRowIndex][this.tableColumnBookmark.englishName] = this.value;    
                        }
            }
        }
    }

    setValueInTableRow(eventArg: any){
        if(this.tableRowIndex === undefined)return;
        if(eventArg.rowIndex !== this.tableRowIndex)return;
        if(eventArg.tableName !== this.parentTableName)return;
        if(!this.tableColumnBookmark)return;
        if(eventArg.data && eventArg.data[this.tableColumnBookmark.englishName])
            this.value = eventArg.data[this.tableColumnBookmark.englishName];
        // if(this.tableRowIndex === 4 && this.tableColumnBookmark.type === 16)
        // {
        //     console.log(eventArg.data[this.tableColumnBookmark.englishName]);
        // }
            
        
        
    }
    setNewValues(newValues: any[]){
        if(!newValues)return;
        const relatedItem =  newValues.find(item=>item.Name === this.englishName);
        if(relatedItem){
            this.value = relatedItem.Value;
        }
        
    }
    beforeDestroy(){
        store.state.eventHub.$off("test-sayname", this.sayName);
        store.state.eventHub.$off('mandatory-values-validation', this.onMandatoryValueValidation);
        store.state.eventHub.$off("form-values-requested", this.getData);
        store.state.eventHub.$off("tablerow-set-requested", this.setValueInTableRow);
        store.state.eventHub.$off("newvalues-set-request", this.setNewValues);
        store.state.eventHub.$off("table-row-romoved",this.onTableRowRemoved);
        
        if((this.bookmark && this.bookmark.type === 13) || (this.tableColumnBookmark && this.tableColumnBookmark.type === 16))
            store.state.eventHub.$off("add-file-requested",this.onAddFileRequested);
    }
    
}


