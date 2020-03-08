<template>
    <div>
        <h3>جزئیات نامه</h3>  
        <div>
            {{title}}
        </div>  
    </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class LetterDetail extends Vue{
 @Prop() title?: string;
}
</script>

