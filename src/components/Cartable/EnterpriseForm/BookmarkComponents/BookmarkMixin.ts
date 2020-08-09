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
            return (this.maxLabelWidth + 20).toString() + 'px'
        return '';
    }

    get defaultValue(){ //این باید اصلاح شود احتمالا
        if(this.bookmark)
            return this.bookmark.defaultValue;
        if(this.tableColumnBookmark)
            return this.tableColumnBookmark.defaultValue;
        return '';
    }
    created(){
        store.state.eventHub.$on("form-values-requested",(e: any)=> this.getData(e));
    }
    
    getData(eventArg: any){
        if((eventArg.tableName === ''  && !this.parentTableName) || (eventArg.tableName === this.parentTableName)){
            const data  = {} as any;
            if(eventArg.tableName === ''){
                if(!this.bookmark)return;
                data.Id = this.bookmark.id;
                data.Name = this.bookmark.englishName;
                data.Value = this.value;
                eventArg[this.bookmark.englishName] = data;
            }
            else{
                
                if(!this.tableColumnBookmark)return;
                if(this.tableRowIndex === undefined)return;
                //if(this.tableColumnBookmark.type === 0 || this.tableColumnBookmark.type === 1 ||  this.tableColumnBookmark.type === 15)//integer or string or time or date
                eventArg.tableData[this.tableRowIndex][this.tableColumnBookmark.englishName] = this.value;    
                // else{
                //     data.Id = this.valueId;
                //     data.Value = this.value;
                //     eventArg.tableData[this.tableRowIndex][this.tableColumnBookmark.englishName] = data;
                // }
            }
        }
    }
    
}


