<template>
    <div style="display:flex">
       
      <div v-if="letterOwners.length>1 && isOwnersLoaded" style="margin-left:5px">
            <div  id="cartables-dropdown"  class="ui icon top left dropdown">
  		                <i class="action-icon icon-comboboxArrow" style="font-size: medium"></i>
  		                <div class="left menu">
    		                <div @click="onLetterOwnerChanged(owner.id)" v-for="owner in letterOwners" :key="owner.id" class="item menu-item"><div style="padding-left:5px">{{owner.nameOnly}}</div></div>
  		                </div>
	        </div>
            <!-- <select style="width: 20px; background-color: transparent;" v-model="selectedOwner" @change="onLetterOwnerChanged($event)">
                <option v-for="item in letterOwners" :key="item.id" :value="item.id">{{item.nameOnly}}</option>
            </select> -->
        </div>
        <div>
            {{ownerName}}
            [{{post}}]
        </div>
        
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import * as api from '@/store/api';
import router from '@/router';
import { LetterOwnerWithPicture } from '@/store/models/LetterOwner/letterOwnerWithPicture';
import * as $ from 'jquery';

@Component
export default class SingleCartableOwner extends Vue{
    ownerName= '';
    post = '';
    ownerImage = '';
    letterOwners = [] as LetterOwnerWithPicture[];
    isOwnersLoaded = false;

    @Watch("letterOwners")
    onLetterOwnersChanged(n: LetterOwnerWithPicture[], o: LetterOwnerWithPicture[]){
        //$(".dropdown").dropdown({action: 'hide',silent: true});
        this.isOwnersLoaded = true;
    }
    async created(){
        const allLetterOwners  = await  api.getLetterOwners();
        this.letterOwners = allLetterOwners.filter(x=>!x.onlyForReceivingIncommingLetter);
        const currentLetterOwner = this.letterOwners[0];
        //this.selectedOwner = currentLetterOwner.id;
        this.post = currentLetterOwner.post;
        this.ownerName = currentLetterOwner.nameOnly;
        this.ownerImage = 'data:image/png;base64, ' + currentLetterOwner.picture;
        this.$store.commit("setOwnerId",currentLetterOwner.id);
        this.$store.commit("setCanSeeAllLetters",currentLetterOwner.canSeeSecuredLetters);
        this.$emit('on-letter-owner-set',false);
        this.$router.replace("ReceivedLetters");
        // $(".dropdown").dropdown({action: 'hide',silent: true});
        
    }
    //selectedOwner = '';
    onLetterOwnerChanged(ownerId: string)
    {
        const currentOwner = this.letterOwners.find(x=>x.id === ownerId /*this.selectedOwner*/);
        if(!currentOwner)return;
        this.post = currentOwner.post;
        this.ownerName = currentOwner.nameOnly;
        this.ownerImage = 'data:image/png;base64, ' + currentOwner.picture;
        this.$store.commit("setOwnerId",currentOwner.id);
        this.$store.commit("setCanSeeAllLetters",currentOwner.canSeeSecuredLetters);
        this.$emit('on-letter-owner-set',true);
        //this.$router.push("ReceivedLetters");
    }
    mounted(){
        $("#cartables-dropdown").dropdown();
    }
    updated(){
        $("#cartables-dropdown").dropdown();
    }
    //isFirstClick = false;
    //activeDropdown(){
        //if(this.isFirstClick)return;
        //$(".dropdown").dropdown({action: 'hide',silent: true});
        //this.isFirstClick = true;
    //}
}
</script>

<style scoped>
    img{
        height: 60px;
        width: 60px;
    }
</style>




