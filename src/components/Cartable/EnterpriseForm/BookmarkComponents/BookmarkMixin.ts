import {Component,Vue, Prop, Watch} from 'vue-property-decorator'
import { EnterpriseFormBookmark } from '@/store/models/EnterpriseForm/EnterpriseFormBookmark';
import { EnterpriseFormTableBookmarkColumn } from '@/store/models/EnterpriseForm/EnterpriseFormTableBookmarkColumn';
import store from '@/store';

@Component
export default class BookmarkMixin extends Vue{
    @Prop() bookmark?: EnterpriseFormBookmark;
    @Prop() tableColumnBookmark?: EnterpriseFormTableBookmarkColumn;
    @Prop() maxLabelWidth?: number;
    @Prop() parentTableName?: string;
    @Prop() tableRowIndex?: number;
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
        return this.value !=='' && this.value !== ({} as any);
    }

    onMandatoryValueValidation(e: any){
        e.allValuesSupplied = e.allValuesSupplied && this.isMandatoryValueSupplied;
        
    }

    created(){
        store.state.eventHub.$on("form-values-requested", this.getData);
        store.state.eventHub.$on("tablerow-set-requested", this.setValueInTableRow);
        store.state.eventHub.$on("newvalues-set-request",this.setNewValues);
        store.state.eventHub.$on("mandatory-values-validation", this.onMandatoryValueValidation );
        //store.state.eventHub.$on("mest",(e: any)=> {this.$destroy(); this.$el.remove(); alert("p");} );
        // store.state.eventHub.$on("test", this.sayName );
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
                if(this.value.Value){
                    data.Value = this.value.Value;
                }
                else
                    data.Value = this.value;
                eventArg[this.bookmark.englishName] = data;
            }
            else{
                
                if(!this.tableColumnBookmark)return;
                if(this.tableRowIndex === undefined)return;
                if(eventArg.tableData)
                    if(eventArg.tableData[this.tableRowIndex])
                        eventArg.tableData[this.tableRowIndex][this.tableColumnBookmark.englishName] = this.value;    
                
            }
        }
    }

    setValueInTableRow(eventArg: any){
        if(this.tableRowIndex === undefined)return;
        if(eventArg.rowIndex !== this.tableRowIndex)return;
        if(!this.tableColumnBookmark)return;
        if(eventArg.data)
            this.value = eventArg.data[this.tableColumnBookmark.englishName];
        
    }
    setNewValues(newValues: any[]){
        if(!newValues)return;
        const relatedItem =  newValues.find(item=>item.Name === this.englishName);
        if(relatedItem)
            this.value = relatedItem.Value;
        
    }
    beforeDestroy(){
        store.state.eventHub.$off('mandatory-values-validation', this.onMandatoryValueValidation);
        store.state.eventHub.$off("form-values-requested", this.getData);
        store.state.eventHub.$off("tablerow-set-requested", this.setValueInTableRow);
        store.state.eventHub.$off("newvalues-set-request", this.setNewValues);
    }
    
}


