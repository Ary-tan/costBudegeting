<template>
  <div class="sidebar">
    <el-menu background-color="#2a3542" text-color="#aeb2b7" active-text-color="#e0e0e0" class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                  {{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import bus from "./bus";

  export default {
    data() {
      return {
        collapse: false,
        items: [
          {
            icon: 'iconfont icon-editor',
            index: 'floor',
            title: '楼栋信息'
          },
          {
            icon: 'iconfont icon-questions',
            index: 'organization',
            title: '成本指标表'
          },
          {
            icon: 'iconfont icon-businesscard',
            index: 'post',
            title: '形象进度表'
          },
          {
            icon: 'iconfont icon-createtask',
            index: 'index',
            title: '预算金额表'
          },
          {
            icon: 'iconfont icon-dynamic',
            index: 'system',
            title: '公司年度预算金额表'
          },
          {
            icon: 'iconfont icon-dynamic',
            index: 'detail',
            title: '预算金额表详情'
          }
        ]
      }
    },
    computed: {
      onRoutes() {
        return this.$route.path.replace('/', '');
      }
    },
    created() {
      bus.$on('collapse', msg => {
        this.collapse = msg;
      })
    }
  }
</script>

<style scoped lang="less" type="text/less">
  .sidebar {
    display: block;
    position: absolute;
    z-index: 110;
    left: 0;
    top: 60px;
    bottom: 0;
    overflow-y: scroll;
  }

  .sidebar::-webkit-scrollbar {
    width: 0;
  }

  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 210px;
  }

  .sidebar > ul {
    height: 100%;
  }
</style>
