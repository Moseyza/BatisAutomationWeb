<template>
    <div id="search-container" class="symmetric-grid" >
        <input type="text" v-model="searchText">
        <div style="padding:3px 3px">
            <i id="search-icon"  class="icon-search"></i>
        </div>
        
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';

@Component
export default class LetterSearch extends Vue {
    searchText = '';
    @Watch('searchText')
    onSearchTextChanged(){
        this.$emit('search-text-changed',this.searchText);
    }
}
</script>

<style lang="less" scoped>
input{
    background-color: #575757;
    color: #e7e7e7;
    width: 100%;
    border: none;
    font-size: small;
    padding: 3px 3px;
}
input:focus{
    outline: none;
}
#search-icon{
    font-size:medium;
    color: #e7e7e7;

}

#search-container{
    background-color:#575757
}

</style>
