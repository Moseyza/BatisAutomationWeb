<template>
    <div class="bg4">
        <div style="flex:1;padding:10px" :class="{success: messageType=='success',fail: messageType=='fail'}">
            {{message}}
        </div>
        <div class="message-box-buttons">
            <div class="dialog-button" @click="ok()" v-if="buttons === 'ok' || buttons === 'okCancel' ">تائید</div>
            <div class="dialog-button" @click="cancel()" v-if="buttons  === 'okCancel' ">انصراف</div>
            <div class="dialog-button" @click="no()" v-if="buttons  === 'yesNo' ">خیر</div>
            <div class="dialog-button" @click="yes()" v-if="buttons  === 'yesNo' ">بله</div>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
@Component
export default class InPlaceMessageBox extends Vue{
    @Prop() message?: string;
    @Prop() messageType?: string;
    @Prop() buttons?: string;
    
    ok(){
        this.$emit("button-clicked",'ok');
    }
    cancel(){
        this.$emit("button-clicked",'cancel');
    }
    yes(){
        this.$emit("button-clicked",'yes');
    }
    no(){
        this.$emit("button-clicked",'no');
    }

}
</script>

<style lang="less" scoped>
.message-box-buttons{
    display: flex;
    justify-content: space-around;
    align-content: center;
}
.message-box-buttons>button{
    flex: 1;
}
.success{
    color:#69b578;
}
.fail{
    color: #ff6b6b;
}
</style>