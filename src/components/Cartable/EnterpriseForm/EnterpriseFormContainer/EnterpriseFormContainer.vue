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
import * as $ from 'jquery';
@Component
export default class EnterpriseFormContainer extends Vue{
    maxLabelLength = 0;
    currentLabel = '';
    @Prop() form?: EnterpriseForm;
    @Prop() tableLblWidth?: number;
    @Prop() formLblWidth?: number;
    drawForm(){
        if(!this.form)return;
        if(!this.form.bookmarks)return;
        this.form.bookmarks.forEach(bookmark => {
            if(bookmark.isVisibleInSend)
                this.addBookmarkToForm(bookmark);    
        });
    }
    addBookmarkToForm(bookmark: EnterpriseFormBookmark){
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
            if(bookmark.type === 18)
                props.maxColumnLabelWidth = this.tableLblWidth;
            const instance = new componentClass({propsData: props});
            instance.$mount();
            (this.$refs.formcontainer as any).appendChild(instance.$el);
        }
    }
   
    created(){
        console.log(this.form);
        //this.calcMaxLabelLength();
    }

    mounted(){
        this.drawForm();
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