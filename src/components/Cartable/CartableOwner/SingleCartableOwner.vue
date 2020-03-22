<template>
    <div>
      {{ownerName}}
      [{{post}}]
      <img :src="ownerImage"/>
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import * as api from '@/store/api';

@Component
export default class SingleCartableOwner extends Vue{
    ownerName= '';
    post = '';
    ownerImage = '';
    async created(){
        const letterOwnersWithPic = await  api.getLetterOwners();
        const currentLetterOwner = letterOwnersWithPic[0];
        this.post = currentLetterOwner.post;
        this.ownerName = currentLetterOwner.nameOnly;
        this.ownerImage = 'data:image/png;base64, ' + currentLetterOwner.picture;
    }
}
</script>

<style scoped>
    img{
        height: 60px;
        width: 60px;
    }
</style>




