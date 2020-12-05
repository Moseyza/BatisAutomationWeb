<template >
    <div id="enterpriseFormLists-container" style="height: 100%;display: flex;justify-content: center;align-items: center;">
        <div v-if="isLoading" class="item" style="flex:1;align-items:center;justify-content:center;">
            <div class="ui active inline centered loader"></div>
        </div> 
        <div v-if="!isLoading" style="background: var(--BackgroundTable);flex: 1;display: flex;flex-direction: column;height: 100%;overflow: scroll;">
            <div v-for="(form) in filteredForms" :key="form.id" class="item menu-item" style="cursor:pointer;border: solid thin;border-color: var(--FontColor); margin:0.3em">
                <div @click="showForm(form.id)" style="padding-left:5px;">{{form.name}}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { EnterpriseForm } from '../../../store/models/EnterpriseForm/EnterpriseForm';
import { Vue, Component, Prop, Watch} from 'vue-property-decorator';
import * as enterpriseFromService from '@/store/Services/enterpriseFormService.ts';
import  store from '@/store';

@Component({
})
export default class EnterpriseFormLists extends Vue {
    
    enterpriseForms = [] as EnterpriseForm[];
    formSearchTxt = '';
    isLoading = false;
    ownerId = '';

    created(){
        this.ownerId =  store.state.ownerId;
        if(this.ownerId === '')return
        this.loadEnterpriseForms();  
    }

     get filteredForms(){
        return this.enterpriseForms.filter(x=>x.name.includes(this.formSearchTxt));
    }

    getFromColor(color: number){
        if(color === 0) return 'var(--BackgroundTable1)';
        const result =  '#' + color.toString(16).substring(2);
        return result;
    }
    
    showForm(id: string){
        const selectedForm =  this.enterpriseForms.find(x=>x.id === id);
        this.$emit('enterprise-form-selected-Mobile',selectedForm);
    }

      async loadEnterpriseForms()
    {
        this.isLoading = true;
        this.enterpriseForms =  await enterpriseFromService.getOwnerEnterpriseForms(this.ownerId);
        this.enterpriseForms = this.enterpriseForms.sort((x,y)=> y.selectionColor - x.selectionColor);
        this.isLoading = false;
    }

    
}
</script>


<style lang="less" scoped>

    #folders-container{
        height: 100%;
        overflow: auto;
    }
    
</style>

