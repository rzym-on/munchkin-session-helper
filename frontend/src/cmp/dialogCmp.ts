import { computed, getCurrentInstance, WritableComputedRef } from 'vue';

export default function getVisibility():WritableComputedRef<boolean> {
  const instance = getCurrentInstance();
  if (instance === null) return computed(() => false);

  const { emit, props } = instance;

  const dialogVisible = computed<boolean>({
    get():boolean { return props.modelValue as boolean; },
    set(val) { emit('update:modelValue', val); },
  });

  return dialogVisible;
}
