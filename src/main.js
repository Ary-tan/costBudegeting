import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";
import ElementUI from "element-ui";
import '../theme/index.css';
import '../src/assets/common.less';

Vue.use(ElementUI, {size: 'mini', zIndex: 3000});
Vue.config.productionTip = false;

Vue.directive('loadmore', {
  bind(el, binding, vnode) {
    let p = 0;
    let t = 0;
    let down = true;
    let selectWrap = el;
    selectWrap.addEventListener('scroll', function () {
      //判断是否向下滚动     
      p = this.scrollTop;
      if (t < p) {
        down = true;
      } else {
        down = false;
      }
      t = p;
      //判断是否到底     
      const sign = 10;
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
      if (scrollDistance <= sign && down) {
        binding.value(true);
      }
    })
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
