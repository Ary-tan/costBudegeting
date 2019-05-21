import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const home = () => import('@/components/common/Home.vue');
const index = () => import('@/components/page/index.vue');
const organization = () => import('@/components/page/organization.vue');
const post = () => import('@/components/page/post.vue');
const system = () => import('@/components/page/system.vue');
const floor = () => import('@/components/page/floor.vue');
const detail = () => import('@/components/page/detail.vue');

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/floor'
    },
    {
      path: '/',
      component: home,
      meta: {title: '首页'},
      children: [
        {
          path: '/floor',
          component: floor,
          meta: {title: '楼栋信息'}
        },
        {
          path: '/index',
          component: index,
          meta: {title: '首页'}
        },
        {
          path: '/organization',
          component: organization,
          meta: {title: '组织机构'}
        },
        {
          path: '/post',
          component: post,
          meta: {title: '岗位信息'}
        },
        {
          path: '/system',
          component: system,
          meta: {title: '系统信息'}
        },
        {
          path: '/detail',
          component: detail,
          meta: {title: '详情'}
        }
      ]
    }
  ]
})
