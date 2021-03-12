# Zendesk App Boilerplate (Vue.js + ES6)
The scope of this project is a to have a ready to go app boilerplate to start building zendesk apps using:


* [Vue.js v2](https://vuejs.org/v2/guide/)

* [ES6](https://www.w3schools.com/js/js_es6.asp) (making sure that IE11 support is not required for the project you are going to work on)

* [Zendesk Garden (CSS Components)](https://zendeskgarden.github.io/css-components/)

### Browser Compatibility
* Chrome
* Safari
* Firefox
* Edge (Please follow these instructions if it doesn't work https://stackoverflow.com/questions/55546730/edge-not-loading-es-6-modules)

#
Below I'll describe some customization I've included in the boilerplate and how/when to use them.

### [manifest.json](#manifestjson-1)
### [.config.json](#.configjson-1)
### [assets/iframe.html](#assetsiframehtml-1)
### [assets/main.js](#assetsmainjs-1)
### [assets/src/store/store.js](#assetssrcstorestorejs-1)
### [assets/src/libs/ZDClient.js](#assetssrclibsZDClientjs-1)


## **manifest.json**

### IS_PRODUCTION Parameter

Looking at the `manifest.json` file you may notice the presence of the paramenter
`IS_PRODUCTION`. This hidden parameter will help you when you work `secure` settings.

```json
{
  "name": "IS_PRODUCTION",
  "type": "hidden",
  "default": "true"
}

```

When you work with `secure` settings, you should set in your ajax request the
property `secure` as `true` and refer to your secure paramenter using the following pattern:
`{{setting.your_secure_param_name}}`.

The code for an ajax request in produciton
ENV should look like:

```javascript
ZDClient.request({
  url: 'url_request',
  headers: {
    authorization: 'Basic {{setting.your_secure_paramenter}}',
  },
  secure: true,
  ...
})
```

Unfortunately this configuration won't work
while you are still working on a local ENV. This would force you to
keep the following structure while you work on a local ENV and then switch it
before realising the app:

```javascript
ZDClient.request({
  url: 'url_request',
  headers: {
    authorization: `Basic ${ZDClient.getSetting('your_secure_paramenter')}`,
  },
  secure: false,
  ...
})
```

By adding `IS_PRODUCTION` parameter setting you can forget about changing this
configuration every time you switch between ENVs. Here is the trick:

The default value is `"true"`, while the `config.json` file will override this with `false`.
In `ZDClient.js` I've added a method called `isProduction()` which will return the current value
for `IS_PRODUCTION` paramenter. Then your code will look like:

```javascript
ZDClient.request({
  url: 'url_request',
  headers: {
    authorization: `Basic ${ZDClient.isProduction() ? '{{setting.your_secure_paramenter}}' : ZDClient.getSetting('your_secure_paramenter')}`,
  },
  secure: ZDClient.isProduction(),
  ...
})
```
**Note:**
This trick will only work if you run `zat server -c config.json`

## **.config.json**

In this file you can declare the values for the app parameters. This way, ZAT won't ask for manual input in the terminal.

`manifest.json`
```javascript
  ...
  "parameters": [
    {
      "name": "IS_PRODUCTION",
      "type": "hidden",
      "default": "true"
    },
    {
      "name": "custom_ticket_id",
      "type": "number",
      "required": "true"
    }
  ],
  ...
```

`.config.json`
```javascript
{
  "IS_PRODUCTION": false,
  "custom_ticket_id": 369900231
}
```

## **assets/iframe.html**

In this file you will find:

* `link` to import all garden components style. Please remove all the imports that are
not needed in your current project.
* `link` to import your local css style.
* `div#app` element where your vuejs app will be injected.
* `script` to import scripts.

## **assets/main.js**

Here is where your Zendesk client and Vue instance will be initilized. You can extend the Vue instance with filters and other utilities.

```javascript
  ...
  const initVueApp = function () {
    new Vue({
      el: '#app',
      render: function (h) { return h(App); },
    });
  };
  
  ZDClient.init();
  ZDClient.events['ON_APP_REGISTERED'](initVueApp);
  ...
```

* `APP_REGISTERED` is handled in `ZDClient.js` as described below.

* If you don't use the `store` in your app, please remove all the references to `store` and `Vuex` in the boilerplate. Also, delete `store` folder from the project.

## **assets/src/store/store.js**
In case of medium/big project you might want to use the `store`. This should be the place where you make all your API request and update your app state.

Please read documentation for reference.

## **assets/src/libs/ZDClient.js**

This file is used to add all the `methods` that make use of `ZAF`.

```javascript
let CLIENT = null;
let APP_SETTINGS = null;

const ZDClient = {
  events: {
    ON_APP_REGISTERED (callback) {
      return CLIENT.on('app.registered', async function (data) {
        APP_SETTINGS = data.metadata.settings;
        return callback(data);
      });
    },
  },
  
  init () {
    CLIENT = ZAFClient.init();
  },
  ...
```

`CLIENT` - this is object is the key point of your app that allows you to communicate
with Zendesk. Keep this object as **private** and expose only `getters` and `setter`
you need to make your app working. Same approach could be used for objects like `APP_SETTINGS` and you could also include `CURRENT_TICKET`, `CURRENT_USER` etc.


`events` - Here is where you collect all the events your app is going to listen to.
By default you have `APP_REGISTERED` which is the event that first fires once `ZAFClient.init()` is called. By passing a `callback` function, you will be able
to handles the response from wherever you want in the code. (See main.js for as example)

**Note:** Those are ment to be only suggestions and not as a must have.