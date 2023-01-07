import { Ref, ref } from 'vue';

interface EditDialogCmp {
  modelId: Ref<number>,
  isVisible: Ref<boolean>,
  showEditDialog: (id:number) => void,
}

export default function getEditDialogCmp():EditDialogCmp {
  const modelId = ref(-1);
  const isVisible = ref(false);

  const showEditDialog = (id:number) => {
    modelId.value = id;
    isVisible.value = true;
  };

  return {
    modelId,
    isVisible,
    showEditDialog,
  };
}
