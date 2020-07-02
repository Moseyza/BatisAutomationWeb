<template>
    <div>
        <div class="fields-row"> 
                <div class="search-field-title">عنوان:</div>
                <div class="search-field-value"> <input type="text"/></div>
                <div class="search-field-title">جستجو در کارتابل:</div>
                <div class="search-field-value"> <input type="text"/></div>
        </div>
        <div class="fields-row"> 
                <div class="search-field-title">خلاصه:</div>
                <div class="search-field-value"> <input type="text"/></div>
                <div class="search-field-title">حاضر در گردش:</div>
                <div class="search-field-value"> <input type="text"/></div>
        </div>
        <div class="fields-row"> 
                <div class="search-field-title">شماره نامه:</div>
                <div class="search-field-value"> <input type="text"/></div>
                <div class="search-field-title">دریافت شده از:</div>
                <div class="search-field-value"> <input type="text"/></div>
        </div>
        <div class="fields-row"> 
                <div class="search-field-title">شماره نامه فرستنده:</div>
                <div class="search-field-value"> <input type="text"/></div>
                <div class="search-field-title">ارسال شده به:</div>
                <div class="search-field-value"> <input type="text"/></div>
        </div>
        <div class="fields-row"> 
                <div class="search-field-title">زمان از:</div>
                <div class="search-field-value"> <input type="text"/></div>
                <div class="search-field-title">زمان تا:</div>
                <div class="search-field-value"> <input type="text"/></div>
        </div>
        <div class="fields-row"> 
                <div class="search-field-title">توضیحات ارجاع:</div>
                <div class="search-field-value"> <input type="text"/></div>
                <div class="search-field-title">یادداشت شخصی:</div>
                <div class="search-field-value"> <input type="text"/></div>
        </div>
        <div class="fields-row"> 
                <div class="search-field-title">توضیحات اختتام:</div>
                <div class="search-field-value"> <input type="text"/></div>
                <div class="search-field-title">فوریت:</div>
                <div class="search-field-value"> <PrioritySelector  :isNullable='true' /></div>
        </div>
        <div class="fields-row"> 
                <div class="search-field-title">زمان پاسخ از:</div>
                <div class="search-field-value"> <input type="text"/></div>
                <div class="search-field-title">زمان پاسخ تا:</div>
                <div class="search-field-value"> <input type="text"/></div>
        </div>
        <div class="fields-row"> 
                <div class="search-field-title">فرم سازمانی:</div>
                <div class="search-field-value"> <input type="text"/></div>
                <div class="search-field-title"> مختومه: </div>
                <div style="display:flex;justify-content:flex-end" class="search-field-value">
                        <TriStateCheckbox/>
                        <div style="margin-left:1px">محرمانه:</div> 
                        <TriStateCheckbox style="margin-left:1px"/>
                        <div style="margin-left:1px">بازگردانده شده:</div> 
                        <TriStateCheckbox style="margin-left:1px"/>
                </div>
        </div>
        <div id="button-panel">
            <button class="action-button"><i class="icon-clearSearch"></i></button>
            <button class="action-button"><i class="icon-search"></i></button>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue,Prop,Component} from 'vue-property-decorator';
import TriStateCheckbox from '@/components/UiComponents/TriStateCheckBox.vue';
import PrioritySelector from '@/components/Cartable/FastSend/PrioritySelector/PrioritySelector.vue';
@Component({
        components: {TriStateCheckbox, PrioritySelector}
})
export default class AdvancedSerach extends Vue
{

}
</script>

<style lang="less" scoped>
    .search-field{
        display: flex;
        margin: 5px;

    }
    .search-field-title{
        width: 100px;
        margin-left: 3px;
    }
     .search-field-value{
        width: 180px;
    }
    .search-field-value>input{
        width: 100%;
    }
    .fields-row{
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
</style>

