<template>
    <div>
        <div class="fields-row"> 
                <div class="search-field-title">عنوان:</div>
                <div class="search-field-value"> <input type="text" v-model="title"/></div>
                <div class="search-field-title">جستجو در کارتابل:</div>
                <div class="search-field-value"><LetterOwnerLookup  :index=4 :selectedValueProp="cartableOwnerId" :letterOwnersProp="allLetterOwners" @letterowner-selected="onLetterOwnerSelected($event,'cartable')" :style="{'pointer-events': canSeeAllLetters?'unset':'none'}" /></div>
        </div>
        <div class="fields-row"> 
                <div class="search-field-title">خلاصه:</div>
                <div class="search-field-value"> <input type="text" v-model="abstract"/></div>
                <div class="search-field-title">حاضر در گردش:</div>
                <div class="search-field-value"><LetterOwnerLookup :index=1 :selectedValueProp="presentInId" :letterOwnersProp="allLetterOwners" @letterowner-selected="onLetterOwnerSelected($event,'present')" /></div>
        </div>
        <div class="fields-row"> 
                <div class="search-field-title">شماره نامه:</div>
                <div class="search-field-value"> <input type="text"/></div>
                <div class="search-field-title">دریافت شده از:</div>
                <div class="search-field-value"> <LetterOwnerLookup :index=2 :selectedValueProp="fromOwnerId" :letterOwnersProp="allLetterOwners" @letterowner-selected="onLetterOwnerSelected($event,'from')" /> </div>
        </div>
        <div class="fields-row"> 
                <div class="search-field-title">شماره نامه فرستنده:</div>
                <div class="search-field-value"> <input type="text"/></div>
                <div class="search-field-title">ارسال شده به:</div>
                <div class="search-field-value"> <LetterOwnerLookup :index=3 :selectedValueProp="toOwnerId" :letterOwnersProp="allLetterOwners" @letterowner-selected="onLetterOwnerSelected($event,'to')" /></div>
        </div>
        <div class="fields-row"> 
                <div class="search-field-title">زمان از:</div>
                <div class="search-field-value"> <input type="text" v-model="dateFrom" id='dateFrom' placeholder="__/__/____" > <VuePersianDatetimePicker :clearable="true" element="dateFrom" v-model="dateFrom" /></div>
                <div class="search-field-title">زمان تا:</div>
                <div class="search-field-value"> <input type="text" v-model="dateTo" id='dateTo' placeholder="__/__/_____"> <VuePersianDatetimePicker :clearable="true" element="dateTo" v-model="dateTo" /></div>
        </div>
        <div class="fields-row"> 
                <div class="search-field-title">توضیحات ارجاع:</div>
                <div class="search-field-value"> <input type="text" v-model="forwardComment"/></div>
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
                <div class="search-field-value"> <input type="text" v-model="responseDateFrom" id='responseDateFrom' placeholder="__/__/_____"> <VuePersianDatetimePicker :clearable="true" element="responseDateFrom" v-model="responseDateFrom" /></div>
                <div class="search-field-title">زمان پاسخ تا:</div>
                <div class="search-field-value"> <input type="text" v-model="responseDateTo" id='responseDateTo' placeholder="__/__/_____"> <VuePersianDatetimePicker :clearable="true" element="responseDateTo" v-model="responseDateTo" /></div>
        </div>
        <div class="fields-row"> 
                <div class="search-field-title">فرم سازمانی:</div>
                <div class="search-field-value"> <input type="text"/></div>         
                <div class="search-field-title"></div>
                <div class="search-field-value"></div>
        </div>
        <div class="fields-row">
                <div class="symmetric-grid">
                        <div class="search-field-title"> مختومه: </div>
                        <TriStateCheckbox :stateProp="isFinalized" @state-changed="onSateChanged($event,'finalized')"/>
                        <div style="margin-left:1px">محرمانه:</div> 
                        <TriStateCheckbox style="margin-left:1px" :stateProp="isSecret" @state-changed="onSateChanged($event,'secret')" />
                        <div style="margin-left:1px">بازگردانده شده:</div> 
                        <TriStateCheckbox style="margin-left:1px" :stateProp="isReturned" @state-changed="onSateChanged($event,'returned')"/>
                </div>
        </div>
        <div id="button-panel">
            <button @click="clear" class="action-button"><i class="icon-clearSearch"></i></button>
            <button @click="doSearch" class="action-button"><i class="icon-search"></i></button>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue,Prop,Component} from 'vue-property-decorator';
import TriStateCheckbox from '@/components/UiComponents/TriStateCheckBox.vue';
import PrioritySelector from '@/components/Cartable/FastSend/PrioritySelector/PrioritySelector.vue';
import LetterOwnerLookup from './LetterOwnerLookup/LetterOwnerLookup.vue';
import * as letterOwnerService from '@/store/Services/letterOwnerService';
import * as letterService from '@/store/Services/letterServices';
import { LetterOwner } from '@/store/models/LetterOwner/LetterOwner';
import store from '@/store';
import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
import letterSearch from '@/store/models/Letter/letterSearch';

@Component({
        components: {TriStateCheckbox, PrioritySelector, LetterOwnerLookup, VuePersianDatetimePicker}
})
export default class AdvancedSerach extends Vue
{       
        allLetterOwners = [] as LetterOwner[];
        canSeeAllLetters = false;
        cartableOwnerId = ''; 
        dateFrom = '';
        dateTo = '';
        responseDateFrom = '';
        responseDateTo = '';
        isFinalized = 'dontCare';
        isSecret = 'dontCare';
        isReturned = 'dontCare';
        presentInId = '';
        fromOwnerId = '';
        toOwnerId = '';
        title = '';
        abstract = '';
        letterNo = '';
        senderLetterNo = '';
        forwardComment = '';
        finalizeComment = '';
        async created(){
               this.allLetterOwners = await letterOwnerService.getAllLetterOwners(); 
               this.canSeeAllLetters = store.state.canSeeAllLetters;
               while(this.cartableOwnerId === ''){
                       this.cartableOwnerId = store.state.ownerId;
               }
        }
        onLetterOwnerSelected(ownerId: string, mode: string){
                if(mode === 'cartable'){
                        this.cartableOwnerId = ownerId;
                }
                else if(mode === 'present')
                        this.presentInId = ownerId;
                else if(mode === 'from')
                        this.fromOwnerId = ownerId;
                else if(mode === 'to')
                        this.toOwnerId = ownerId;

                
        }
        onSateChanged(state: string, mode: string){
                if(mode === 'finalized')
                        this.isFinalized = state;
                if(mode === 'secret')
                        this.isSecret = state;
                if(mode === 'returned')
                        this.isReturned = state;
                
        }

        clear(){
                this.isFinalized = 'dontCare';
                this.isSecret = 'dontCare';
                this.isReturned = 'dontCare';
                this.presentInId = '';
                this.fromOwnerId = '';
                this.toOwnerId = '';
                this.dateFrom = '';
                this.dateTo = '';
                this.responseDateFrom = '';
                this.responseDateTo = '';
                this.title = '';
                this.abstract = '';
                this.letterNo = '';
                this.senderLetterNo = '';

        }

        async doSearch(){
                const searchDto = {} as letterSearch ;
                searchDto.title = this.title;
                searchDto.abstract = this.abstract;
                searchDto.SearchingOwner = {} as LetterOwner;
                searchDto.SearchingOwner.id = store.state.ownerId;
                searchDto.searchInLetterOwnerDashboard = {} as LetterOwner;
                searchDto.searchInLetterOwnerDashboard.id = this.cartableOwnerId;
                searchDto.isConjunctive = true;
                //const result =  await letterService.SearchAll(searchDto);
                store.commit("setAdvancedSearchSettings",searchDto);
                this.$router.replace({name: "SearchResults"});
                //console.log(result);

                //searchDto.
        }
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
        font-size: small;
    }
     .search-field-value{
        width: 125px;
        font-size: small;
    }
    .search-field-value>input{
        width: 100%;
    }
    .fields-row{
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    input[type=text]{
            border: none;
            outline: none;
    }
    
</style>

