<template>
    <div class="prty-slctr bg1 chamfer">
        <label @click="select('low')"  class="chk-container" >
            <input  type="checkbox" :checked="isLow" disabled>
            <span class="checkmark" style="background-color:#69b578"></span>
        </label>
        <label @click="select('med')"  class="chk-container">
            <input  type="checkbox" :checked="isMed" disabled>
            <span class="checkmark" style="background-color:#e9c46a" ></span>
        </label>
        <label @click="select('high')" class="chk-container">
            <input  type="checkbox" :checked="isHigh" disabled>
            <span class="checkmark" style="background-color:#ff6b6b" ></span>
        </label>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class PrioritySelector extends Vue{
    isLow = true;
    isMed = false;
    isHigh = false;
    @Prop() isNullable?: boolean;
    select(mode: string){
        if(mode === 'high')
        {
            if(this.isNullable) this.isHigh = !this.isHigh;
            else this.isHigh = true;
            this.isMed = false;
            this.isLow = false;
        }
        else if(mode === 'med'){
            this.isHigh = false;
            if(this.isNullable) this.isMed = !this.isMed;
            else this.isMed = true;
            this.isLow = false;
        }
        else if(mode === 'low'){
            this.isHigh = false;
            this.isMed = false;
            if(this.isNullable) this.isLow = !this.isLow;
            else this.isLow = true;
        }
        if(!this.isMed && !this.isLow && !this.isHigh)
          this.$emit('priority-changed',null);
        else  
          this.$emit('priority-changed',mode);
    }
    created(){
        if(this.isNullable){
            this.isLow = false;
        }
    }
}
</script>

<style lang="less" scoped>
.prty-slctr{
    display: flex;
    justify-content: space-around;
}

/* The container */
.chk-container {
  display: block;
  position: relative;
 // padding-left: 30px;
  //margin-bottom: 15px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border-radius: 5px;
}

/* Hide the browser's default checkbox */
.chk-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: #eee;
  border-radius: 3px
}

/* On mouse-over, add a grey background color */
.chk-container:hover input ~ .checkmark {
  background-color: #ccc;
  border-radius: 3px
}

/* When the checkbox is checked, add a blue background */
.chk-container input:checked ~ .checkmark {
  
  border-radius: 3px
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.chk-container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.chk-container .checkmark:after {
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>