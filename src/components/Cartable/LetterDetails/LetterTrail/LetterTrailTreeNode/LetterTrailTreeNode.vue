<template>
    <ul>
        <li>
                <div>
                    <i v-if="isOpened" class="icon-openedLetter"></i>
                    <i v-else class="icon-notOpenedLetter"></i>
                    <span> {{nodeData.sender.nameOnly}} </span>  
                    <span style="font-size:8pt; color:#939393">{{nodeData.sender.letterOwnerCompanyNameOnly}}</span>
                </div>
            <div>
            <LetterTrailTreeNode
            v-for="item in nodeData.recievers"
            :key="item.senderId"
            :nodeData="item"
            ></LetterTrailTreeNode>
            </div>
        </li>
    </ul>
</template>

<script lang="ts">

import {Vue, Prop, Component, Watch} from 'vue-property-decorator';
import { LetterTrail } from '@/store/models/Letter/LetterTrail';
import { getPersianDate } from '@/util/utils';
@Component
export default class LetterTrailTreeNode extends Vue {
    
    @Prop() nodeData?: LetterTrail;

    get isOpened(){
        console.log("test");
        console.log(this.nodeData);
        
        if(this.nodeData === undefined) return false;
        console.log(getPersianDate(this.nodeData.sendTime,"dddd dd MMMM"));
        if(this.nodeData.openTime === null)
            return false;
        else
            return true;
    }

}

</script>

<style lang="less" scoped>
    ul{
        list-style-type: none;
    }
    #node-row{
        display: flex;

    }
    #node-row>div{
        flex: 1;
    }
</style>



