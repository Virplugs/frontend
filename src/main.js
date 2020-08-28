import Vue from 'vue';
import VueObserveVisibility from 'vue-observe-visibility';

import App from '@/App.vue';

import '@/menu.js';

console.log('Loading Virplugs...');

const robotjs = require('robotjs');
robotjs.setMouseDelay(0);

window.win = require('electron').remote.getCurrentWindow();

Vue.use(VueObserveVisibility);

Vue.config.productionTip = false;

window.vueRoot = new Vue({
	render: h => h(App, { ref: 'app' }),
}).$mount('#app');

window.app = window.vueRoot.$root.$children[0];
