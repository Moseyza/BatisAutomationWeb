<template>
    <div style="display:flex;flex-direction:column">
        <div style="width:100%;">
            <textarea @click="onTextAreaClick()" style="color:var(--FontColor);width:100%;height:20px;resize:none;border:none;background-color:transparent;outline:none;" @blur="onFocusOut()" v-model="comment" @focus="showList()" ></textarea>
        </div>
        <div v-if="shallShowList" style="position:absolute;z-index:100;margin-top:20px;border-radius:5px;max-height:200px;max-width:300px;min-width:300px;overflow:auto" class="bg1">
            <div v-for="item in filteredData" @click="selectItem(item.name)" :key="item.id" style="border:1px solid gray;color:var(--FontColor);cursor:pointer"  >{{item.name}}</div>
        </div>
        
    </div>
</template>

<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import { AutoCompleteData } from '@/store/models/Letter/AutoCompleteData';
@Component
export default class CommentEditor extends Vue{
    @Prop() data?: AutoCompleteData[];
    shallShowList = false;
    comment = '';
    get filteredData(){
        if(!this.data) return[];
        return this.data.filter(item=>item.name.includes(this.comment));
    }

    showList(){
        //this.shallShowList = !this.shallShowList;
    }
    selectItem(value: string){
        this.shallShowList = false;
        this.comment = value;
    }

    @Watch('comment')
    onCommentChanged(n: string, o: string){
        this.$emit('comment-changed',this.comment);
    }
    onFocusOut(){
        //this.shallShowList = false;
    }
    onTextAreaClick(){
        this.shallShowList = !this.shallShowList;
    }
}
</script>


