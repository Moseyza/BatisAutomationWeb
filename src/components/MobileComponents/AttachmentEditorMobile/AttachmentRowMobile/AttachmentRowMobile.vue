<template>
    <div class="symmetric-grid">
        <div style="flex:6;overflow: hidden; text-overflow: ellipsis;white-space: nowrap;}">{{file.name}}</div>
        <div style="flex:1;"  @click="remove()" ><i style="font-size: large;" class="icon-x action-icon"></i></div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
@Component
export default class AttachmentRow extends Vue{
@Prop() file?: File;
@Prop() index?: number;
remove(){
    this.$emit("removed",this.index);
}
}
</script>

