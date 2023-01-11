import { createI18n } from 'vue-i18n';
import enUS from './en-US/en-US';
import pl from './pl-PL/pl-PL';

const messages = {
  'en-US': enUS,
  'pl-PL': pl,
};
export default messages;

export const i18n = createI18n({
  locale: 'en-US',
  legacy: false,
  messages,
});
