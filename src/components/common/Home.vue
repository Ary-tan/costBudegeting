<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div v-loading="loading" class="content-box" :class="{'content-collapse':collapse}">
      <div class="content">
        <transition name="move" mode="out-in">
          <keep-alive :include="tagsList">
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import vHead from './Header.vue';
  import vSidebar from './Sidebar.vue';
  import bus from "./bus";

  export default {
    data() {
      return {
        loading: false,
        tagsList: [],
        collapse: false
      }
    },
    components: {
      vHead, vSidebar
    },
    created() {
      bus.$on('collapse', msg => {
        this.collapse = msg;
      });
      bus.$on('loading', msg => {
        this.loading = msg;
      });
    }
  }
</script>

<style lang="less" type="text/less" scoped>

</style>
