<template>
    <div>
      {{ownerName}}
      [{{post}}]
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import * as api from '@/store/api';
import router from '@/router';

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
        this.$store.commit("setOwnerId",currentLetterOwner.id);
        this.$store.commit("setCanSeeAllLetters",currentLetterOwner.canSeeSecuredLetters);
        this.$emit('on-letter-owner-set');
        this.$router.replace("ReceivedLetters");
    }
}
</script>

<style scoped>
    img{
        height: 60px;
        width: 60px;
    }
</style>




