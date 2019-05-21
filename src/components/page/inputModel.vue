<template>
  <div @click="onFieldClick" class="edit-cell">
    <!--<el-tooltip v-if="!editMode && !showInput"-->
                <!--:placement="toolTipPlacement"-->
                <!--:open-delay="toolTipDelay"-->
                <!--:content="toolTipContent">-->
      <div v-if="!editMode && !showInput" tabindex="0"
           class="cell-content"
           :class="{'edit-enabled-cell': canEdit}"
           @keyup.enter="onFieldClick">
        <slot name="content"></slot>
      </div>
    <!--</el-tooltip>-->
    <component :is="editableComponent"
               v-if="editMode || showInput"
               ref="input"
               @blur="inputBlur"
               @change="selectChange"
               @focus="onFieldClick"
               @keyup.enter.native="onInputExit"
               v-model="text"
               v-bind="$attrs">
      <slot name="edit-component-slot"></slot>
    </component>
  </div>
</template>
<script>
  export default {
    name: "editable-cell",
    inheritAttrs: false,
    props: {
      value: {
        type: [String, Number],
        default: ""
      },
      toolTipContent: {
        type: String,
        default: "点击编辑"
      },
      toolTipDelay: {
        type: Number,
        default: 500
      },
      toolTipPlacement: {
        type: String,
        default: "top"
      },
      showInput: {
        type: Boolean,
        default: false
      },
      editableComponent: {
        type: String,
        default: "el-input"
      },
      closeEvent: {
        type: String,
        default: "blur"
      },
      canEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        text: '',
        editMode: false
      };
    },
    created() {
      this.text = this.value;
    },
    methods: {
      inputBlur() {
        if (this.editableComponent !== 'el-input') return;
        this.$emit("input", this.text);
        this.editMode = false;
        this.$emit("addSaveData");
        this.$emit("numChange");
      },
      selectChange(val) {
        this.editMode = false;
        if (this.editableComponent !== 'el-input') {
          this.$emit("input", this.text);
        } else {
          this.$emit("input", val);
        }
        this.$emit("addSaveData");
        this.$emit("numChange");
      },
      onFieldClick() {
        if (this.canEdit) {
          this.editMode = true;
          this.$nextTick(() => {
            let inputRef = this.$refs.input;
            if (inputRef && inputRef.focus) {
              inputRef.focus();
            }
          });
        }
      },
      onInputExit() {
        this.editMode = false;
      }
    }
  };
</script>
