
import {Component,Vue, Prop, Watch} from 'vue-property-decorator'
import { EnterpriseFormBookmark } from '@/store/models/EnterpriseForm/EnterpriseFormBookmark';
import { EnterpriseFormTableBookmarkColumn } from '@/store/models/EnterpriseForm/EnterpriseFormTableBookmarkColumn';

@Component
export default class BookmarkMixin extends Vue{
    @Prop() bookmark?: EnterpriseFormBookmark;
    @Prop() tableColumnBookmark?: EnterpriseFormTableBookmarkColumn;
    @Prop() maxLabelWidth?: number;
    value: any = {};
    @Watch('value')
    onValueChanged(newVal: any, oldVal: any){
        //alert(newVal);
        console.log('parent');
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
}


