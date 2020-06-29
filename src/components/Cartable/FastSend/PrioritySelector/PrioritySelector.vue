<template>
    <div class="prty-slctr container1 chamfer">
        <label @click="select('low')"  class="container" >
            <input  type="checkbox" :checked="isLow" disabled>
            <span class="checkmark" style="background-color:#69b578"></span>
        </label>
        <label @click="select('med')"  class="container">
            <input  type="checkbox" :checked="isMed" disabled>
            <span class="checkmark" style="background-color:#e9c46a" ></span>
        </label>
        <label @click="select('high')" class="container">
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
    select(mode: string){
        if(mode === 'high')
        {
            this.isHigh = true;
            this.isMed = false;
            this.isLow = false;
        }
        else if(mode === 'med'){
            this.isHigh = false;
            this.isMed = true;
            this.isLow = false;
        }
        else if(mode === 'low'){
            this.isHigh = false;
            this.isMed = false;
            this.isLow = true;
        }
        this.$emit('priority-changed',mode);
    }
}
</script>

<style lang="less" scoped>
.prty-slctr{
    display: flex;
    justify-content: space-around;
}

/* The container */
.container {
  display: block;
  position: relative;
  padding-left: 30px;
  margin-bottom: 15px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border-radius: 5px;
}

/* Hide the browser's default checkbox */
.container input {
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
  height: 20px;
  width: 20px;
  background-color: #eee;
  border-radius: 3px
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
  border-radius: 3px
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  
  border-radius: 3px
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 8px;
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