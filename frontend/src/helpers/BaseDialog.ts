import {
  Vue, prop, WithDefault,
} from 'vue-class-component';

class Props { modelValue: WithDefault<boolean> = prop({ default: false }); }

export default abstract class BaseDialog extends Vue.with(Props) {
  beforeClose:any = undefined;

  afterClose:any = undefined;

  beforeOpen:any = undefined;

  afterOpen:any = undefined;

  closeDialog() {
    this.dialogVisible = false;
  }

  get dialogVisible():boolean {
    return this.modelValue;
  }

  set dialogVisible(val:boolean) {
    if (!val && this.beforeClose) this.beforeClose();
    if (val && this.beforeOpen) this.beforeOpen();

    // New changes in v3
    // https://v3.vuejs.org/guide/migration/v-model.html#v-model
    this.$emit('update:modelValue', val);

    if (!val && this.afterClose) this.afterClose();
    if (val && this.afterClose) this.afterOpen();
  }
}
