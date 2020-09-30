<template>
    <div style="display:flex">
        <div v-if="letterOwners.length>1" style="margin-left:5px">
            <select style="width: 20px; background-color: transparent;" v-model="selectedOwner" @change="onLetterOwnerChanged($event)">
                <option v-for="item in letterOwners" :key="item.id" :value="item.id">{{item.nameOnly}}</option>
            </select>
        </div>
        <div>
        {{ownerName}}
        [{{post}}]
      </div>
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import * as api from '@/store/api';
import router from '@/router';
import { LetterOwnerWithPicture } from '@/store/models/LetterOwner/letterOwnerWithPicture';

@Component
export default class SingleCartableOwner extends Vue{
    ownerName= '';
    post = '';
    ownerImage = '';
    letterOwners = [] as LetterOwnerWithPicture[]
    async created(){
        this.letterOwners = await  api.getLetterOwners();
        const currentLetterOwner = this.letterOwners[0];
        this.selectedOwner = currentLetterOwner.id;
        this.post = currentLetterOwner.post;
        this.ownerName = currentLetterOwner.nameOnly;
        this.ownerImage = 'data:image/png;base64, ' + currentLetterOwner.picture;
        this.$store.commit("setOwnerId",currentLetterOwner.id);
        this.$store.commit("setCanSeeAllLetters",currentLetterOwner.canSeeSecuredLetters);
        this.$emit('on-letter-owner-set',false);
        this.$router.replace("ReceivedLetters");
    }
    selectedOwner = '';
    onLetterOwnerChanged(e: any)
    {
        const currentOwner = this.letterOwners.find(x=>x.id === this.selectedOwner);
        if(!currentOwner)return;
        this.post = currentOwner.post;
        this.ownerName = currentOwner.nameOnly;
        this.ownerImage = 'data:image/png;base64, ' + currentOwner.picture;
        this.$store.commit("setOwnerId",currentOwner.id);
        this.$store.commit("setCanSeeAllLetters",currentOwner.canSeeSecuredLetters);
        this.$emit('on-letter-owner-set',true);
        this.$router.push("ReceivedLetters");
    }
}
</script>

<style scoped>
    img{
        height: 60px;
        width: 60px;
    }
</style>




