const template = /*html*/`
<div>
  <h1>{{ i18n.helloWorld }}</h1>
</div>
`;

import { state, getters, methods } from '../store/store.js';

const SampleComponent = {
  template,
  computed: {
    state: function () { return state; },
    ...getters
  },
  mounted () {
    this.$emit('resize');
  },
  updated () {
    this.$emit('resize');
  },
  methods: {
    ...methods
  },
};

export default SampleComponent;
