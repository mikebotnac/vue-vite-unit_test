// vite-plugin-vue-i18n can use the vite (rollup) mechanism to import all
// locales at once, using the special identifier
// @intlify/vite-plugin-vue-i18n/messages, as the bellow:

import { createI18n } from 'vue-i18n';

/*
 * All i18n resources specified in the plugin `include` option can be loaded
 * at once using the import syntax
 */
import messages from '@intlify/vite-plugin-vue-i18n/messages';

const i18n = createI18n({
  locale: 'en',
  messages,
});

//export const { t, tm } = i18n.global;

export default i18n;
