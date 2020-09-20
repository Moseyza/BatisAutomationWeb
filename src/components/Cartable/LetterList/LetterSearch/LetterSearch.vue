<template>
    <div class="symmetric-grid">
        <div id="search-container" class="symmetric-grid">
            <input type="text" v-model="searchText">
            <div style="padding:3px 3px">
                <div style="padding:3px 3px" id="search-dropdown" class="ui icon top left dropdown">
                    <i class="search-icon action-icon icon-comboboxArrow"></i>
                    <div class=" menu">
                        <div style="background-color:#3f3f3f" class="item menu-item">
                            <AdvancedSearch/>
                        </div>
                    </div>
                </div>
            </div>
            <div style="padding:3px 3px" id="filter-dropdown" class="ui icon top left dropdown ">
                <i class="search-icon icon-filter action-icon "></i>
                <div class="menu">
                    <div class="item menu-item">
                        <div style="padding-left:5px">همه({{counts.all}})</div>
                        <ToggleSwitch :checkedProp="showAll" @click="onToggleSwitchClick('all')" :isReadOnly="true" /> </div>
                    <div class="item menu-item">
                        <div style="padding-left:5px">غیر فرم سازمانی({{counts.notForms}})</div>
                        <ToggleSwitch :checkedProp="showNotForms" @click="onToggleSwitchClick('notForms')" :isReadOnly="true" /> </div>
                    <div class="item menu-item">
                        <div style="padding-left:5px">فرم های سازمانی({{counts.forms}})</div>
                        <ToggleSwitch :checkedProp="showForms" @click="onToggleSwitchClick('forms')" :isReadOnly="true" />
                        <div class="left menu" >
                            <div v-for="wf in workflows" :key="wf.id" class="item menu-item" :class="{'disabled': !showForms}">
                                <div style="padding-left:5px">{{wf.name}}</div>
                                <div class="left menu">
                                    <div v-for="item in wf.enterpriseForms" :key="item.id" class="item menu-item">
                                        <div style="padding-left:5px"> {{item.name}} </div>
                                        <ToggleSwitch @checked-changed="formFilterSelection($event,item.id)" /> </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="divider"></div>
                    <div class="item menu-item">
                        <div style="padding-left:5px">بارگذاری براساس تاریخ</div>
                        <div class="left menu ">
                            <div class="item menu-item">
                                <div style="padding-left:5px">سال</div>
                                <div class="left menu">
                                    <div v-for="year in yearsArray" :key="year.value" class="item menu-item">
                                        <div style="padding-left:5px"> {{year.value}} </div>
                                        <ToggleSwitch isReadOnly=t rue :checkedProp="year.isSelected" @click="yearSelected(year.value)" /> </div>
                                </div>
                            </div>
                            <div class="item menu-item scrolling">
                                <div style="padding-left:5px">ماه</div>
                                <div class="left menu " style="max-height:300px;overflow:auto">
                                    <div v-for="month in months" :key="month.id" class="item menu-item ">
                                        <div style="padding-left:5px"> {{month.name}} </div>
                                        <ToggleSwitch isReadOnly=t rue :checkedProp="month.isSelected" @click="monthSelected(month.id)" /> </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                    <div class="item menu-item">
                        <div style="padding-left:5px">مرتب سازی براساس</div>
                        <div class="left menu ">
                            <div class="item menu-item">
                                <div style="padding-left:5px">تاریخ</div>
                                <ToggleSwitch isReadOnly=t rue :checkedProp="sortOnDate" @click="sortModeChanged('date')" />
                            </div>
                            <div class="item menu-item">
                                <div style="padding-left:5px">نام فرستنده</div>
                                <ToggleSwitch isReadOnly=t rue :checkedProp="sortOnSender" @click="sortModeChanged('sender')" />
                            </div>
                            <div class="item menu-item">
                                <div style="padding-left:5px">عنوان</div>
                                <ToggleSwitch isReadOnly=t rue :checkedProp="sortOnTitle" @click="sortModeChanged('title')" />
                            </div>
                        </div>
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
import AdvancedSearch from './AdvancedSearch/AdvancedSearch.vue';
import letterSearch from '../../../../store/models/Letter/letterSearch';
import store from '@/store';
import { LetterOwner } from '../../../../store/models/LetterOwner/LetterOwner';

@Component({
    components: { ToggleSwitch, AdvancedSearch }
})
export default class LetterSearch extends Vue {
    searchText = '';
    showAll = true;
    showForms = false;
    showNotForms = false;
    sortOnDate = true;
    sortOnSender = false;
    sortOnTitle = false;
    @Watch('searchText')
    onSearchTextChanged() {
        this.$emit('search-text-changed', this.searchText);
    }

    mounted() {
        $('#filter-dropdown').dropdown({ action: 'nothing' });
        $('#search-dropdown').dropdown({ action: 'nothing' });
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

        } else if (mode === 'forms') {
            this.showAll = false;
            this.showForms = true;
            this.showNotForms = false;

        } else if (mode === 'notForms') {
            this.showAll = false;
            this.showForms = false;
            this.showNotForms = true;
        }
        this.$emit('mode-changed', mode);
    }
    formFilterSelection(checked: boolean, formId: string) {
        this.$emit("form-selection", { isSelected: checked, formId: formId });
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
        this.$router.push({name: "SearchResults"}).catch(err=>{ console.log('')});
    }


}
</script>

<style lang="less" scoped>
input {
    background-color: #575757;
    color: #e7e7e7;
    width: 100%;
    border: none;
    font-size: small;
    padding: 3px 3px;
}

input:focus {
    outline: none;
}

.search-icon {
    font-size: large; //color: #e7e7e7;
}

#search-container {
    background-color: #575757
}
</style>
