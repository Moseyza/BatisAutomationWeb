<template>
    <div class="bg5 comment-container"  >
        <div class="bg4" style="border-radius:5px 5px  0 0">{{type}}</div>
        <div>تاریخ: {{formattedTime}}</div>
        <div v-if="comment">{{label}} {{comment}}</div>
        <div v-if="attachments && attachments.length>0" style="overflow: hidden;display:flex; justify-content:flex-start"  >
            <div style="flex:0 1 auto;white-space:nowrap">اصل و پیوست ها:</div>
            <div style="display:flex;align-items:center;justify-content:flex-start;flex-wrap:wrap; overflow-x:hidden;flex:1 0 0">
                <LetterAttachment  v-for="(file,index) in attachments" 
                :key="index"
                :file ="file"
                :index ="index"
                @remove="onAttachmentRemoved($event)"
                style="margin: 2px"
                />
            </div>
        </div>
    </div>

    
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import * as util from '@/util/utils';
import LetterAttachment from '@/components/Cartable/LetterDetails/LetterAttachment/LetterAttachment.vue';
import File from '../../../../../../store/models/Letter/File';
@Component({
    components: {LetterAttachment}
})
export default class LetterTrailNodeComment extends Vue{
    @Prop() mode?: string;
    @Prop() sendTime?: string;
    @Prop() comment?: string;
    @Prop() attachments?: File[];
    get formattedTime(){
        if(!this.sendTime) return '';
        return util.getPersianFullFormatDate(this.sendTime);
    }

    get type(){
        switch(this.mode){
            case 'send': return 'ارسال';
            case 'forward': return 'ارجاع';
            case 'close': return 'اختتام';
            default: return '';
        }
        
    }

    get label(){
        switch(this.mode){
            case 'send': return 'هامش:';
            case 'forward': return 'هامش:';
            case 'close': return 'توضیحات:';
            default: return '';
        }
    }
}   
</script>

<style lang="less" scoped>
    .comment-container{
        border-radius: 5px;
        margin:2px 5px;
        overflow: hidden;

    }
    .comment-container>div{
        padding: 5px;

    }
</style>