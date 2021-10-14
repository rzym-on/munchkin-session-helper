<template>
  <q-dialog v-model="dialogVisible">
    <q-card style="width: 700px">
      <q-card-section style="max-height: 50vh" class="scroll">
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >
        <div class="text-h6">New player</div>

        <q-separator />

        <div class="row">
          <div class="col-md-12 col-12">
            <q-input
              dense
              outlined
              v-model="name"
              label="Player name *"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
          </div>
          <div class="col-md-6 col-12">
            <div class="row">
              <div class="col-2">
                <span class="dot" :style="'background-color: '+color"></span>
              </div>
              <div class="col-10">
                <q-input
                  outlined
                  dense
                  v-model="color"
                  :rules="['anyColor']"
                  label="Player color *"
                >
                  <template v-slot:append>
                    <q-icon name="colorize" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-color default-view="palette" format-model="hex" v-model="color" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-12">
            <div class="row justify-center items-center">
              <q-radio v-model="isWoman" :val="true" label="Woman" />
              <q-radio v-model="isWoman" :val="false" label="Man" />
            </div>
          </div>
        </div>
        <q-card-actions align="right">
          <q-btn label="Add player" type="submit" color="primary"/>
        </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import type { QVueGlobals } from 'quasar';
import { Options } from 'vue-class-component';
import { useAction } from '@/store/helpers/useModules';
import BaseDialog from '@/helpers/BaseDialog';

@Options({ name: 'edit-player' })
export default class EditPlayer extends BaseDialog {
  name = '';

  isWoman = false;

  color = '#ffffff';

  q:QVueGlobals = useQuasar();

  beforeClose = () => {
    this.name = '';
    this.color = '#ffffff';
    this.isWoman = false;
  }

  onSubmit():void {
    const player = {
      name: this.name,
      isWoman: this.isWoman,
      color: this.color,
    };

    useAction('user', 'addPlayer')(player);

    this.q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'check',
      message: `Added player: ${this.name}`,
    });

    this.closeDialog();
  }
}
</script>
<style lang="scss" scoped>
.dot {
  height: 25px;
  width: 25px;
  border-radius: 50%;
  margin-top: 8px;
  display: inline-block;
}

.body--light {
  .dot {
    border: 1px solid grey;
  }
}
</style>
