import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

//Tooltips
import Tooltip from 'vue-directive-tooltip';
import 'vue-directive-tooltip/css/index.css';

Vue.use(Tooltip,{delay: 0, placement: 'auto',class: '',triggers: ['hover'],offset: 0
});

var filter = function(text, length, clamp){
    clamp = clamp || '...';
    var node = document.createElement('div');
    node.innerHTML = text;
    var content = node.textContent;
    return content.length > length ? content.slice(0, length) + clamp : content;
};

Vue.filter('truncate', filter);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  Tooltip,
  render: h => h(App)
}).$mount('#app');