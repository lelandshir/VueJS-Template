import i18n from '../i18n/dictionary.js';
import ZDClient from '../services/ZDClient.js';

export const state = Vue.observable({
  i18n,
});

export const getters = {
  i18n () { return state.i18n; }
};

export const methods = {
  loadCurrentUserLocale () { 
    return ZDClient.getCurrentUserLocale(state.i18n.en.errorGetCurrentUserLocale)
      .then(function (userLocale) {
        return userLocale;
      });
  },
  setAppLocation (userLocale) {
    if (state.i18n[userLocale] !== undefined) {
      state.i18n = state.i18n[userLocale] ;
    } else {
      const variation = userLocale.split('-');
      state.i18n = i18n[variation[0]] === undefined ? i18n['en'] : i18n[variation[0]];
    }
  },
  resizeApp () {
    ZDClient.resizeFrame(this.$el.scrollHeight);
  }
};