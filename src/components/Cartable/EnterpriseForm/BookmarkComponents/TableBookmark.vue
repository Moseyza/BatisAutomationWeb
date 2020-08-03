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
@Component
export default  class  TableBookmark extends Mixins(BookmarkMixin){
    @Prop() maxColumnLabelWidth?: number;
    created(){
        this.value = '';
    }

    addRow(){
        if(!this.bookmark)return;
        if(!this.bookmark.tableColumns)return;
        this.bookmark.tableColumns.forEach(columnBookmark=>{
            if(columnBookmark && columnBookmark.isVisible){
                const columnComponent = this.getColumnBookmarkComponent(columnBookmark);
                if(columnComponent){
                    (this.$refs.tablecontainer as any).appendChild(columnComponent);
                }
            }
        })
    }

    getColumnBookmarkComponent(columnBookmark: EnterpriseFormTableBookmarkColumn){
        let componentClass = undefined;
        const props = {} as any;
        props.tableColumnBookmark = columnBookmark;
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
            //case 13:
            case 15:
                componentClass = Vue.extend(KeyboardTimeBookmark);
                break;
        }
        if(componentClass){
            if(this.maxColumnLabelWidth)
            {
                props.maxLabelWidth = this.maxColumnLabelWidth;
            }
            const instance = new componentClass({propsData: props});
            instance.$mount();
            return instance.$el;
        }
        return undefined;
    }
}
</script>