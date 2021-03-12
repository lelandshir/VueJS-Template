import App from './components/App.js';
import ZDClient from './services/ZDClient.js';

document.addEventListener('DOMContentLoaded', function () {
  // You can receive the context and metadata in the function below
  // by adding a parameter. E.g.: const initVueApp = function (data) { ...
  const initVueApp = function () {
    new Vue({
      el: '#app',
      render: function (h) { return h(App); },
    });
  };
  
  ZDClient.init();
  ZDClient.events['ON_APP_REGISTERED'](initVueApp);
});