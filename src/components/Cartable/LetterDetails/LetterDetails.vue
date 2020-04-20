<template>
    <div id="main-container" class="container">
        <div class="symmetric-grid">
            <div style="flex:3">
                <h3>{{letter.title}}</h3>
            </div>
            <div style="flex:1" class="symmetric-grid">
                <i class="action-icon icon-comment"></i>
                <i class="action-icon icon-closedLetter"></i>
                <i class="action-icon icon-threeDots"></i>
            </div>
        </div>
        <div>
            <div v-if="isReceived">نامه های دریافتی</div>
            <div v-else>نامه های ارسالی</div>
        </div>
        <div class="container3">
            <div class="symmetric-grid">
                <h4 class="highlight" v-if="isReceived">{{letter.sender.nameOnly}}</h4>
                <div v-else>
                    <div v-for="receiver in letter.recievers" :key="receiver.id"><h4 class="highlight">{{receiver.nameOnly}}</h4> <br/></div>
                </div>
                <div>
                    <i @click="downloadLetterPdf()" class="helper-icon-large icon-pdf"></i>
                </div>
            </div>
        </div>
        <div>
            <div v-if="letter.comment !==''">
                <div style="margin: 10px 0">هامش: {{letter.comment}}</div>
                <div class="symmetric-grid" style="padding:20px">
                    <div style="flex:1"></div>
                    <div style="flex:2;border-bottom:2px #e7e7e7 solid;"></div>
                    <div style="flex:1"></div>
                </div>
            </div>
            <div>
                <p>
                    {{letter.abstract}}
                </p>
            </div>
        </div>
        
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import { Letter } from '@/store/models/Letter/Letter';
import { saveFile, converBase64toBlob } from '@/util/utils';
import * as api from '@/store/Services/fileService';
@Component
export default class LetterDetails extends Vue {

    isReceived = true;
    @Prop() letter?: Letter;
    @Watch("letter")
    onLetterChanged(newVal: Letter, oldVal: Letter){
        this.setIsReceived();
    }
    created(){
        this.setIsReceived();
    }
    
    setIsReceived(){
        this.isReceived = false;
        if(this.letter == undefined)return;
        if(this.letter.recievers === null)
            this.isReceived = true;
    }

    async downloadLetterPdf(){
        if(this.letter === undefined)return;
        if(this.letter.parts === undefined || this.letter.parts === null)return;
        const file = await api.getFile(this.letter.parts[0].file.id);
        const blob =  converBase64toBlob(file.content||"",'');
        saveFile(blob,file.extension);
    }
    
    
}
</script>
<style lang="less" scoped>
    #main-container{
       //display: flex;
    }
</style>

