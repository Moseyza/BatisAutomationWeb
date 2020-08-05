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
        this.$emit('value-changed',this.value);
    }

    get persianName(){
        //if(!this.maxLabelLength)return '';
        if(this.bookmark)return this.bookmark.persianName;//.padEnd(this.maxLabelLength,' ');
        else if(this.tableColumnBookmark) return this.tableColumnBookmark.persianName;//.padEnd(this.maxLabelLength,' ');
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
                data.Id = this.valueId;
                data.Value = this.value;
                eventArg.tableData[this.tableRowIndex][this.tableColumnBookmark.englishName] = data;
            }
        }
    }
    // getObject(){
    //     const object  = {} as any;
    //     if(this.bookmark)
    //     {
    //         object.Id = this.bookmark.id;
    //         object.Name = this.bookmark.englishName;
    //         object.Value = this.value;
    //     }
    //     if(this.tableColumnBookmark){
    //         object.Id = this.valueId;
    //         object.Value = this.value;
    //     }
        
    //     return object;
    // }
}


