module.exports = {
  i18n: {
    defaultLocale: 'hr',
    locales: ['hr', 'en', 'de', 'it', 'fr', 'cs', 'pl', 'hu'],
  },
  localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
