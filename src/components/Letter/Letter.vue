<template>
    <router-link to="/letterDetail" tag="div" >
        <div class="letter">
            <div>عنوان: {{letterData.title}} </div>
            <div>از: {{letterData.from}} </div>
            <div>تاریخ: {{letterData.date}}</div>
            <div>شماره: {{letterData.number}}</div>
            <div>خلاصه: {{letterData.summary}}</div>
            <div>هامش:{{letterData.footNote}}</div>
        </div>
    </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {LetterDto} from '@/store/models';

@Component
export default class Letter extends Vue {

    @Prop() letterData?: LetterDto;
   
}
</script>

<style scoped>
    .letter{
        background-color:darkolivegreen;
        margin: 8px;
        direction: rtl;
    }
</style>



