import Vue from 'vue';
import VueObserveVisibility from 'vue-observe-visibility';

import App from '@/App.vue';

import '@/menu';

console.log('Loading Virplugs...');

(window as any).win = require('electron').remote.getCurrentWindow();

Vue.use(VueObserveVisibility);

Vue.config.productionTip = false;

(window as any).vueRoot = new Vue({
	render: h => h(App, { ref: 'app' }),
}).$mount('#app');

(window as any).app = (window as any).vueRoot.$root.$children[0];
