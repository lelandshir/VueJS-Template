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
  
  /**
  * Set getters for privite objects
  */
  app: {
    get settings () { return APP_SETTINGS; },
    
    /**
    * It returns true if the app is installed in the instance, false if
    * it's running locally
    */
    get isProduction () { return !!this.settings['IS_PRODUCTION']; },
  },
  
  /**
  * Notify user that something happened
  * Usually after taking some action
  * @param {string} message
  * @param {string} type
  * @param {number} durationInMs
  */
  notifyUser (message, type = 'error', durationInMs = 5000) {
    CLIENT.invoke('notify', message, type, durationInMs);
  },
  
  /**
  * It sets the frame height using on the passed value.
  * The width is fixed on 100%
  * @param {number} appHeight
  */
  resizeFrame (appHeight) {
    CLIENT.invoke('resize', {width: '100%', height: `${appHeight}px`});
  },
  
  /**
  * Get current user locale
  * @param {string} errorMessage
  * @returns {Promise<string>}
  */
  getCurrentUserLocale (errorMessage) {
    return CLIENT.get('currentUser.locale')
      .then(function(response) {
        if (!!response['currentUser.locale'])
          return response['currentUser.locale'];
        this.notifyUser(errorMessage, 'error');
        return '';
      }.bind(this))
      .catch(function(error) {
        this.notifyUser(errorMessage, 'error');
        console.error('Error on ZDClient.js at getCurrentUserLocale function: ', error);
        return '';
      }.bind(this));
  }
};

export default ZDClient;
