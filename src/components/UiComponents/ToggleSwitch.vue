<template>
    <label @click="onClick()" class="switch">
        <input type="checkbox" v-model="checked" :disabled="isReadOnly">
        <span class="slider round"></span>
    </label>    
</template>

<script lang="ts">
import {Vue,Component,Prop, Watch} from 'vue-property-decorator';
@Component
export default class ToggleSwitch extends Vue {
    checked = false;
    @Watch('checked')
    onCheckedChanged(){
        this.$emit('checked-changed',this.checked);
    }
    @Prop() isReadOnly?: boolean;
    @Prop() checkedProp?: boolean;
    @Watch('checkedProp')
    onCheckPropChanged(newVal: boolean, oldVal: boolean){
      this.checked = newVal;
    }
    created(){
      if(this.checkedProp)
        this.checked = this.checkedProp;
    }
    onClick(){
      this.$emit("click");
    }
}

</script>

<style lang="less" scoped>

.switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 17px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--DetailBackground);
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 13px;
  width: 13px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #69b578;
}

input:focus + .slider {
  box-shadow: 0 0 1px #69b578;
}

input:checked + .slider:before {
  -webkit-transform: translateX(13px);
  -ms-transform: translateX(13px);
  transform: translateX(13px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

</style>


