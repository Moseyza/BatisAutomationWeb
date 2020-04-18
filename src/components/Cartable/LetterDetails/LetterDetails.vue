<template>
    <div style="background-color:yellow;">
        details
        <span>{{letter.title}}</span>
        <span>{{letter.id}}</span>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import { Letter } from '@/store/models/Letter/Letter';

@Component
export default class LetterDetails extends Vue {
    @Prop() letter?: Letter;
    @Prop() letterTitle?: string;
  
 
}
</script>
