import { useI18n } from 'vue-i18n';

/**
 * Translate strings with vue-i18n.
 */
export function useTranslation() {
  const { t, tm, n, locale } = useI18n();

  return {
    t,
    tm,
    n,
    locale,
  };
}
