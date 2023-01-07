import { boot } from 'quasar/wrappers';
import axios from 'axios';

interface Config {
  url: string,
}

let config = {} as Config;

export function useConfig() {
  return config;
}

export default boot(async () => {
  const { data } = await axios.get<Config>(`${import.meta.env.BASE_URL}config.json`);
  config = data;
});
