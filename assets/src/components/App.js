const template = /*html*/`
<div>
  <sample-component @resize="resizeApp" />
</div>`;

import { state, getters, methods } from '../store/store.js';
import SampleComponent from './SampleComponent.js';

const App = {
  template,
  components: {
    SampleComponent,
  },
  computed: {
    state () { return state; },
    ...getters
  },
  created () {
    this.loadCurrentUserLocale()
      .then(function (userLocale) {
        this.setAppLocation(userLocale); 
      }.bind(this));
  },
  mounted () {
    this.resizeApp();
  },
  updated () {
    this.resizeApp();
  },
  methods: {
    ...methods
  },
};

export default App;
