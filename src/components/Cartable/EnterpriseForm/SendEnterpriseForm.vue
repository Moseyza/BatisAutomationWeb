<template>
    <div class="three-part-flexbox">
        <div class="flex-part-top"></div>
        <div class="flex-part-middle">
            <EnterpriseFormContainer :formLblWidth="formLblWidth" :tableLblWidth="tableLblWidth"  :form="form"/>
        </div>
        <div class="flex-part-bottom"></div>
    </div>
</template>

<script lang="ts">
import {Vue,Component,Prop, Watch} from 'vue-property-decorator';
import StringBookmark from './BookmarkComponents/StringBookmark.vue';
import EnterpriseFormContainer from './EnterpriseFormContainer/EnterpriseFormContainer.vue';
import {EnterpriseForm} from '@/store/models/EnterpriseForm/EnterpriseForm';
@Component({
    components: {EnterpriseFormContainer}
})
export default class SendEnterpriseForm extends Vue{
    @Prop() form?: EnterpriseForm;
    @Prop() formLblWidth?: number;
    @Prop() tableLblWidth?: number;
}
</script>