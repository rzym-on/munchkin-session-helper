/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed } from 'vue';
import store from '@/store/index';

export function useStates(module:string, stateProps:string[]):any {
  const keypair = stateProps.map((prop) => [prop, computed(() => store.state[module][prop])]);
  return Object.fromEntries(keypair);
}

export function useState(module:string, stateProp:string):any {
  return store.state[module][stateProp];
}

export function useGetters(module:string, getters:string[]):any {
  const keypair = getters.map((getter) => [getter, computed(() => store.getters[`${module}/${getter}`])]);
  return Object.fromEntries(keypair);
}

export function useGetter(module:string, getter:string):any {
  return computed(() => store.getters[`${module}/${getter}`]);
}

export function useMutations(module:string, mutations: string[]):any {
  const keypair = mutations.map((mutation) => [mutation, (input):void => store.commit(`${module}/${mutation}`, input)]);
  return Object.fromEntries(keypair);
}

export function useMutation(module:string, mutation: string):CallableFunction {
  return (input):void => store.commit(`${module}/${mutation}`, input);
}

export function useActions(module:string, actions: string[]):any {
  const keypair = actions.map((action) => [action, (input) => store.dispatch(`${module}/${action}`, input)]);
  return Object.fromEntries(keypair);
}

export function useAction(module:string, action: string):CallableFunction {
  return (input) => store.dispatch(`${module}/${action}`, input);
}
