import { LocalStorage } from 'quasar';
import { computed, reactive, ref } from 'vue';

export default function useFontSize(
  minSize = 15,
  maxSize = 30,
  lineHeightRatio = 1.4,
  persist = true,
) {
  const limit = reactive({
    max: maxSize,
    min: minSize,
  });
  const size = ref(minSize);
  if (persist) {
    size.value = LocalStorage.getItem<number>('font-size') ?? minSize;
  }
  function changeSize(value: number) {
    size.value += value;
    if (persist) LocalStorage.set('font-size', size.value);
  }
  const lineHeight = computed(() => size.value * lineHeightRatio);

  return {
    size,
    limit,
    changeSize,
    lineHeight,
  };
}
