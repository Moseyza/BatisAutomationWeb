<template>
    <div class="symmetric-grid">
        <div id="search-container" class="symmetric-grid">
            <input type="text" v-model="searchText">
            <i @click="clearSearchText()" class="action-icon icon-removeFile small-text"></i>
            <div style="padding:3px 3px">
                <div style="padding:3px 3px" id="search-dropdown" class="ui floating right dropdown">
                    <i class="search-icon action-icon icon-comboboxArrow"></i>
                    <div class="right menu">
                        <div style="background-color:var(--NormalBackground);" class="item">
                            <AdvancedSearchMobile/>
                        </div>
                    </div>
                </div>
            </div>
            <div style="padding:3px 3px" id="filter-dropdown" class="ui icon top right dropdown ">
                <i class="search-icon icon-filter action-icon " :class="{'active':isFilterActive}"></i>
                <div class="menu">
                    <div class="item menu-item">
                        <div style="padding-left:5px">همه({{counts.all}})</div>
                        <ToggleSwitch :checkedProp="showAll" @click="onToggleSwitchClick('all')" :isReadOnly="true" /> </div>
                    <div class="item menu-item">
                        <div style="padding-left:5px">غیر فرم سازمانی({{counts.notForms}})</div>
                        <ToggleSwitch :checkedProp="showNotForms" @click="onToggleSwitchClick('notForms')" :isReadOnly="true" /> </div>
                    <div class="item menu-item">
                        <div  id="test" class="ui styled fluid accordion">
                            <div class="title" style="display:flex;">
                                <div style="padding-left:5px">فرم های سازمانی({{counts.forms}})</div>
                                <ToggleSwitch :checkedProp="showForms" @click="onToggleSwitchClick('forms')" :isReadOnly="true" />
                            </div>
                            <div class="content">
                                <div class="transition hidden">
                                    <div style="max-height:400px !important;overflow:auto;" >
                                        <SingleEnterpriseSearch :workflows="workflows"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="divider"></div>
                    <div class="item menu-item">
                        <div  id="test" class="ui styled fluid accordion">
                            <div class="title" style="direction: ltr;display:flex;">
                                <i id="baseOnTime" class="search-icon action-icon icon-comboboxArrow" style="transform: rotate(-90deg);"></i>
                                <div>بارگذاری براساس تاریخ</div>
                            </div>
                            <div class="content">
                                <div class="transition hidden">
                                    <div style="padding-left:5px">سال</div>
                                    <div v-for="year in yearsArray" :key="year.value" class="item menu-item">
                                        <div style="padding-left:5px"> {{year.value}} </div>
                                        <ToggleSwitch :isReadOnly="true" :checkedProp="year.isSelected" @click="yearSelected(year.value)" /> 
                                    </div>
                                    <div style="padding-left:5px">ماه</div>
                                    <div v-for="month in months" :key="month.id" class="item menu-item ">
                                        <div style="padding-left:5px"> {{month.name}} </div>
                                        <ToggleSwitch :isReadOnly="true" :checkedProp="month.isSelected" @click="monthSelected(month.id)" /> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item menu-item">
                        <div  id="test" class="ui styled fluid accordion">
                            <div class="title" style="direction: ltr;display:flex;">
                                <i id="baseOnEtc" class="search-icon action-icon icon-comboboxArrow" style="transform: rotate(-90deg);"></i>
                                <div>مرتب سازی براساس</div>
                            </div>
                            <div class="content">
                                <div class="transition hidden">
                                    <div>
                                        <div style="padding-left:5px">تاریخ</div>
                                        <div class="item menu-item">
                                            <ToggleSwitch :isReadOnly="true" :checkedProp="sortOnDate" @click="sortModeChanged('date')" />
                                        </div>
                                        <div style="padding-left:5px">نام فرستنده</div>
                                        <div class="item menu-item">
                                            <ToggleSwitch :isReadOnly="true" :checkedProp="sortOnSender" @click="sortModeChanged('sender')" />
                                        </div>
                                        <div style="padding-left:5px">عنوان</div>
                                        <div class="item menu-item">
                                            <ToggleSwitch :isReadOnly="true" :checkedProp="sortOnTitle" @click="sortModeChanged('title')" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- <div style="padding-left:5px">مرتب سازی براساس</div> -->
                        <!-- <div class="right menu ">
                            <div class="item menu-item">
                                <div style="padding-left:5px">تاریخ</div>
                                <ToggleSwitch :isReadOnly="true" :checkedProp="sortOnDate" @click="sortModeChanged('date')" />
                            </div>
                            <div class="item menu-item">
                                <div style="padding-left:5px">نام فرستنده</div>
                                <ToggleSwitch :isReadOnly="true" :checkedProp="sortOnSender" @click="sortModeChanged('sender')" />
                            </div>
                            <div class="item menu-item">
                                <div style="padding-left:5px">عنوان</div>
                                <ToggleSwitch :isReadOnly="true" :checkedProp="sortOnTitle" @click="sortModeChanged('title')" />
                            </div>
                        </div> -->
                    </div>
                </div>
            </div>    
        </div>
        <div @click="nonConjunctiveSearch()" style="padding:5px; margin:5px" class="action-icon bg4">
            <i class="search-icon icon-search"></i>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import ToggleSwitch from '@/components/UiComponents/ToggleSwitch.vue';
import * as $ from 'jquery';
import { Workflow } from '../../../../store/models/workflow/workflow';
import AdvancedSearchMobile from './AdvancedSearchMobile/AdvancedSearchMobile.vue';
import SingleEnterpriseSearch from './SingleEnterpriseSearch/SingleEnterpriseSearch.vue';
import letterSearch from '../../../../store/models/Letter/letterSearch';
import store from '@/store';
import { LetterOwner } from '../../../../store/models/LetterOwner/LetterOwner';

@Component({
    components: { ToggleSwitch, AdvancedSearchMobile,SingleEnterpriseSearch }
})
export default class LetterSearchMobile extends Vue {
    searchText = '';
    showAll = true;
    showForms = false;
    showNotForms = false;
    sortOnDate = true;
    sortOnSender = false;
    sortOnTitle = false;
    isFilterActive = false;
    @Watch('searchText')
    onSearchTextChanged() {
        this.$emit('search-text-changed', this.searchText);
    }
    clearSearchText(){
        this.searchText = "";
    }
    created(){
         $('.ui.accordion').accordion();
         $('#test').accordion();
         $('#test1').accordion();
    }
    mounted() {
        $('#filter-dropdown').dropdown({ action: 'nothing' });
        $('#search-dropdown').dropdown({ action: 'nothing' });
         $('.ui.accordion').accordion();
         $('#test').accordion();
         $('#test1').accordion();


        this.months.push(...[
            { isSelected: false, name: "فروردین", id: 1 },
            { isSelected: false, name: "اردیبهشت", id: 2 },
            { isSelected: false, name: "خرداد", id: 3 },
            { isSelected: false, name: "تیر", id: 4 },
            { isSelected: false, name: "مرداد", id: 5 },
            { isSelected: false, name: "شهریور", id: 6 },
            { isSelected: false, name: "مهر", id: 7 },
            { isSelected: false, name: "آبان", id: 8 },
            { isSelected: false, name: "آذر", id: 9 },
            { isSelected: false, name: "دی", id: 10 },
            { isSelected: false, name: "بهمن", id: 11 },
            { isSelected: false, name: "اسفند", id: 12 },
        ]);

    }


    @Prop() workflows?: Workflow[];
    @Prop() counts?: any;
    @Prop() years?: number[];
    @Prop() defaultDate?: any;
    @Watch("defaultDate")
    onDefaultDateChanged(n: any, o: any) {
        if(n.month == o.month && n.year== o.year)return;
        this.monthSelected(n.month);
        this.yearSelected(n.year);

    }

    yearsArray = [] as any[];
    @Watch('years')
    onYearsChanged(newVal: number[], oldVal: number[]) {
        this.yearsArray.length = 0;
        newVal.forEach(year => {
            this.yearsArray.push({ value: year, isSelected: this.defaultDate.year === year });
        });
    }


    months: any[] = [];



    monthSelected(monthId: number) {
        //this.months.length = 0;
        this.months.forEach(month => { month.isSelected = false; });
        const selectedMonth = this.months.find(month => month.id === monthId);
        if (selectedMonth)
            selectedMonth.isSelected = true;
        this.sendDateChangedMessage();

    }

    yearSelected(val: number) {
        this.yearsArray.forEach(year => { year.isSelected = false; });
        const selectedYear = this.yearsArray.find(year => year.value === val);
        if (selectedYear)
            selectedYear.isSelected = true;
        this.sendDateChangedMessage();
    }

    sendDateChangedMessage() {
        const year = this.yearsArray.find(y => y.isSelected);
        const month = this.months.find(m => m.isSelected);
        if (month && year) {
            this.$emit('date-filter-changed', { month: month.id, year: year.value });
        }
    }

    sortModeChanged(mode: string) {
        this.sortOnDate = false;
        this.sortOnSender = false;
        this.sortOnTitle = false;
        if (mode === 'date') this.sortOnDate = true;
        if (mode === 'title') this.sortOnTitle = true;
        if (mode === 'sender') this.sortOnSender = true;
        this.$emit('sort-mode-changed', mode);
    }

    onToggleSwitchClick(mode: string) {
        if (mode === 'all') {
            this.showAll = true;
            this.showForms = false;
            this.showNotForms = false;
            this.isFilterActive = false;

        } else if (mode === 'forms') {
            this.showAll = false;
            this.showForms = true;
            this.showNotForms = false;
            this.isFilterActive = true;

        } else if (mode === 'notForms') {
            this.showAll = false;
            this.showForms = false;
            this.showNotForms = true;
            this.isFilterActive = true;
        }
        this.$emit('mode-changed', mode);
    }
    

    nonConjunctiveSearch(){
        if(this.searchText.trim() === '')return;
        const searchDto = {} as letterSearch;
        searchDto.allStrings = this.searchText;
        searchDto.isConjunctive = false;
        searchDto.SearchingOwner = {} as LetterOwner;
        searchDto.SearchingOwner.id = store.state.ownerId;
        searchDto.searchInLetterOwnerDashboard = {} as LetterOwner;
        searchDto.searchInLetterOwnerDashboard.id = store.state.ownerId;
        store.commit("setAdvancedSearchSettings",searchDto);
        this.$router.push({name: "SearchResultsMobile"}).catch(err=>{ console.log('')});
    }


}
</script>

<style lang="less" scoped>
input {
    background-color: var(--BackgroundTable);
    color: var(--FontColor);
    width: 100%;
    border: none;
    font-size: small;
    padding: 3px 3px;
}

input:focus {
    outline: none;
}

.search-icon {
    font-size: large;
}

#search-container {
    background-color: var(--BackgroundTable)
}
.active{
    color: #ff6b6b;
}
.ui.dropdown>.left.menu {
    left: 0!important;
    right: auto !important;
}
.ui.accordion{
    background:var(--BackgroundTable) !important;
    color: var(--FontColor) !important;
}
.active{
    color: var(--FontColor) !important;
}

.title.active:first-child #baseOnTime{
    -webkit-transform: rotate(360deg) !important;
    transform: rotate(360deg) !important;
}
.title.active:first-child #baseOnEtc{
    -webkit-transform: rotate(360deg) !important;
    transform: rotate(360deg) !important;
}
</style>
