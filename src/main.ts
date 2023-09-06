import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import { Fragments } from '@/use/vue';
import ElementUI from 'element-ui';
import TgUI from '@/tiange';
import './styles/element/index.css';
import './styles/reset.less';
import App from './App.vue';
import router from './router';
import store from './store';
import publicFunc from '@/utils/public_func';
Vue.prototype.publicFunc = publicFunc;
import { install } from '@/components/tipDialog/extend';
import inputExtend from '@/components/form/inputExtend';
import '@/assets/scss/element-ui-rewrite.scss';
import VueLazyload from 'vue-lazyload';
import './components';
import '@/styles/common.scss';
import '@/styles/css.scss';
import '@/assets/iconfont2/iconfont.css';
import '@/assets/iconfont2/iconfont-zuanshi.css';
import '@/assets/iconfont2/icon-list.css';
import '@/assets/iconfont2/iconfont-kaipiao.css';
import '@/assets/iconfont2/iconfont-zhuanpiao.css';
import '@/assets/iconfont2/arrow-left.css';
import '@/assets/iconfont2/duigou.css';
import '@/assets/iconfont2/iconfont-weixiao.css';
import VXETable from 'vxe-table';
import 'vxe-table/lib/index.css';
import VueAnimateNumber from 'vue-animate-number';
import { setupDirective } from './modules/directive';

Vue.use(VueAnimateNumber);
Vue.use(VXETable);
Vue.use(VueCompositionAPI);
Vue.use(ElementUI);
Vue.use(TgUI);

Vue.component(Fragments.name, Fragments);
Vue.component(inputExtend.name, inputExtend);

Vue.prototype.$gmMessage = install;

Vue.config.productionTip = false;
Vue.config.devtools = process.env.VUE_APP_TARGET_ENV !== 'production';

Vue.use(VueLazyload, {
  preLoad: 1,
  loading: require('@/assets/img/logo_icon.png'),
  attempt: 1,
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

(window as any).router = router;
setupDirective();
