<template>
    <div class="ui page dimmer message-box">
        <div class="content">
            <div class="message-box-frame bg4">
                <div style="flex:1;padding:10px" :class="{success: messageType=='success',fail: messageType=='fail'}">
                    {{message}}
                </div>
                <div class="message-box-buttons">
                    <div class="dialog-button" @click="ok()" v-if="buttons === 'ok' || buttons === 'okCancel' ">تائید</div>
                    <div class="dialog-button" @click="cancel()" v-if="buttons  === 'okCancel' ">انصراف</div>
                    <div class="dialog-button" @click="yes()" v-if="buttons  === 'yesNo' ">بله</div>
                    <div class="dialog-button" @click="no()" v-if="buttons  === 'yesNo' ">خیر</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import * as $ from 'jquery';
@Component
export default class MessageBox extends Vue{

    @Prop() message?: string;
    @Prop() messageType = '';
    @Prop() buttons?: string;
    @Prop() isActive?: boolean;
    @Watch('isActive')
    onIsActiveChanged(nVal: boolean, oVal: boolean){
        if(nVal)
        {
            $(".message-box").dimmer('show');
        }
        else
        {
            $(".message-box").dimmer('hide');
        }
    }
    
    mounted(){
        $(".message-box").dimmer({closable: false});
         if(this.isActive)
        {
            $(".message-box").dimmer('show');
        }
        else
        {
            $(".message-box").dimmer('hide');
        }
    }

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
.message-box-frame{
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    border-radius: 3px;
}
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
