import { computed } from 'vue';
import { useStore } from 'vuex';

export function useState(module:string, stateProps:string[]):any {
  const store = useStore();
  const keypair = stateProps.map((prop) => [prop, computed(() => store.state[module][prop])]);
  return Object.fromEntries(keypair);
}

export function useGetters(module:string, getters:string[]):any {
  const store = useStore();
  const keypair = getters.map((getter) => [getter, computed(() => store.getters[module][getter])]);
  return Object.fromEntries(keypair);
}

export function useMutations(module:string, mutations: string[]):any {
  const store = useStore();
  const keypair = mutations.map((mutation) => [mutation, (input) => store.commit(`${module}/${mutation}`, input)]);
  return Object.fromEntries(keypair);
}

export function useActions(module:string, actions: string[]):any {
  const store = useStore();
  const keypair = actions.map((action) => [action, (input) => store.dispatch(`${module}/${action}`, input)]);
  return Object.fromEntries(keypair);
}
