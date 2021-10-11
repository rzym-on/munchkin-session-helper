<template>
  <q-dialog v-model="inputVal">
    <q-card>
      <q-card-section>
        <div class="text-h6">New player</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="name"
            label="Player name *"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />

          <div>
            <q-btn label="Submit" type="submit" color="primary"/>
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <!-- <q-card-actions align="right">
        <q-btn flat label="Decline" color="primary" v-close-popup />
        <q-btn flat label="Accept" color="primary" v-close-popup />
      </q-card-actions> -->
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import type { QVueGlobals } from 'quasar';
import {
  Vue, Options, prop, WithDefault,
} from 'vue-class-component';
import { useAction } from '@/store/helpers/useModules';
import { PlayerState } from '@/colyseus/schema/PlayerState';

class Props { modelValue: WithDefault<boolean> = prop({ default: false }); }

@Options({ name: 'edit-player' })
export default class EditPlayer extends Vue.with(Props) {
  name = '';

  q:QVueGlobals = useQuasar();

  get inputVal():boolean {
    return this.modelValue;
  }

  set inputVal(val:boolean) {
    this.$emit('update:modelValue', val);
    // New changes in v3
    // https://v3.vuejs.org/guide/migration/v-model.html#v-model
  }

  onSubmit():void {
    useAction('user', 'addPlayer')(this.name);

    this.q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'check',
      message: `Added player: ${this.name}`,
    });

    this.inputVal = false;
    this.name = '';
  }
}
</script>
