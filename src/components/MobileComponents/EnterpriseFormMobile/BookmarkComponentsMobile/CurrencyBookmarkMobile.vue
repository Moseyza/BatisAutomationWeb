<template>
    <div class="symmetric-grid" style="margin-bottom:5px">
        <div :style="{'width':maxLabelWidthStr}" >
            <span style="white-space: break-spaces;">{{persianName}}</span>
            <span v-if="isMandatory" style="color:red;">*</span>
            <span style="float:left">:</span>
        </div>
        <div style="flex:1;padding:0 5px">
            <input type="text" style="width:100%;border:none;outline:none" @blur="focusOut()" :style="{'background-color': columnColor}" v-model="amount" :readonly="isReadOnly"/>
        </div>
    </div>
</template>

<script lang="ts">
import BookmarkMixin from '@/components/Cartable/EnterpriseForm/BookmarkComponents/BookmarkMixin';
import {Vue,Component,Prop, Watch,Mixins} from 'vue-property-decorator';
@Component
export default  class  CurrencyBookmarkMobile extends Mixins(BookmarkMixin){
    amount = '';
    created(){
        this.value = 0;
    }
    @Watch('amount')
    onAmountChanged(newVal: string, oldVal: string){
         if(!newVal)return;
        const array = newVal.split('');
        if(array.length == 0)return;
        if(isNaN(parseInt(array[array.length -1]))){
             this.amount = (this.amount as string).substring(0,this.amount.length -1);
        }
        this.amount = this.amount.replace(',','');
        this.amount = this.formatMoney(this.amount);
    }
    formatMoney(amount: string) {
        amount =  amount.replace(',','');
        const j = (amount.length > 3) ? amount.length % 3 : 0;
        const result =   (j ? amount.substr(0, j) + "," : '') + amount.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + ",");
        return result;
    }
    focusOut(){
        this.value = parseInt(this.amount.replace(',',''));
         this.$emit("value-changed",this.englishName);
    }
    onValueChanged(){
        this.amount = this.formatMoney((this.value as number).toString());
    }
}
</script>

