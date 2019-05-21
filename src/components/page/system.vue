<template>
  <div class="post" ref="post">
    <header class="header">预算金额表</header>
    <div class="post-body" v-loading="loading">
      <div class="table-header">
        <div>
          <el-button size="mini" @click="outputExcel"><i style="font-size: 12px" class="iconfont icon-keyboard"></i>导出Excel
          </el-button>
        </div>
      </div>
      <div class="table" :style="{height: height + 'px'}">
        <div class="table-row">
          <div class="cell">项目分期 / 楼栋</div>
          <div class="cell" v-for="(item, index) in tableHeader" :key="index">
            {{item.feeOv === '0' ? item.projectName : ''}}
          </div>
        </div>
        <div class="table-row">
          <div class="cell">时间点当前项目状态</div>
          <div class="cell" v-for="(item, index) in tableHeader" :key="index">
            {{item.feeOv === '0' ? item.stateName : ''}}
          </div>
        </div>
        <div class="table-row">
          <div class="cell">费用类别</div>
          <div class="cell" v-for="(item, index) in tableHeader" :key="index">
            <span v-if="item.feeName === '小计'">{{item.feeName}}</span>
            <p class="tool-tips" @click="$router.push({path: '/detail', query: {feeType: item.feeOv, projectNo: item.projectNo, projectSysCode: item.projectSysCode, stateOv: item.stateOv}})">{{item.feeName}}</p>
          </div>
        </div>
        <!--<div class="table-row">-->
          <!--<div class="cell">2019年项目修建情况</div>-->
          <!--<div class="cell" v-for="(item, index) in tableHeader" :key="index">暂无参数</div>-->
        <!--</div>-->
        <div class="table-row">
          <div class="cell">建筑面积</div>
          <div class="cell" v-for="(item, index) in tableHeader" :key="index">{{item.actualArea}}</div>
        </div>
        <div class="table-row">
          <div class="cell">支付单方</div>
          <div class="cell" v-for="(item, index) in tableHeader" :key="index">{{item.singlePrice}}</div>
        </div>
        <div class="table-row">
          <div class="cell">合计（万元）</div>
          <div class="cell" v-for="(item, index) in tableHeader" :key="index">{{item.amount}}</div>
        </div>
        <div class="table-row" v-for="(item, index) in tableData">
          <div class="cell">{{index.substr(index.length - 2) === '13' ? '小计' : index}}</div>
          <div class="cell" v-for="(list, idx) in item" :key="idx">{{list.amount}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import _api from '../common/httpApi';
  import {outputExcel} from "../common/mixins.js";
  import bus from '../common/bus';

  export default {
    name: 'index',
    mixins: [outputExcel],
    data() {
      return {
        height: 0,
        tableData: [],
        id: '',
        tableHeader: [],
        loading: false,
        allData: null,
        item: ''
      }
    },
    mounted() {
      let mainItem = JSON.parse(sessionStorage.getItem('mainItem'));
      if (mainItem) {
        this.id = JSON.parse(sessionStorage.getItem('mainItem')).cycleNo;
        bus.$on('getTemplate', () => {
          this.id = JSON.parse(sessionStorage.getItem('mainItem')).cycleNo;
          this.getData();
        });
      }
      this.item = JSON.parse(sessionStorage.getItem('index'));
      this.$nextTick().then(() => {
        let dom = this.$refs.post;
        this.height = dom.scrollHeight - 125;
      });
      this.getData();
    },
    beforeDestroy() {
      bus.$off('getTemplate');
    },
    methods: {
      floorChange(val) {
        this.getData(val);
        let temp = this.versionData.filter(item => {
          if (item.projectNo === val) return item
        })[0];
        this.item.floorNumName = temp.projectName;
      },
      getData(val) {
        if (!this.id) {
          this.$message.warning('请选择楼栋信息...');
          return
        }
        this.loading = true;
        _api.getYearBudgetAmount({projectNo: val ? val : this.id}, (res) => {
          if (res.code === 1000) {
            if (Object.keys(res.data).length === 0) {
              this.allData = [];
              this.tableData = [];
              this.tableHeader = [];
              this.loading = false;
              return;
            }
            this.allData = res.data;
            this.tableData = JSON.parse(JSON.stringify(res.data));
            this.tableHeader = res.data[1];
            delete this.tableData[1];
            this.$nextTick(() => {
              this.loading = false;
            });
          } else {
            this.$message.error(res.msg);
            this.loading = false;
          }
        });
      },
      outputExcel() {
        let tableName = ['时间点当前项目状态', '费用类别', '建筑面积', '支付单方', '合计（万元）'];
        let tableKey = ['stateName', 'feeName', 'actualArea', 'singlePrice', 'amount'];
        let tableData = [];
        for (let i in this.allData) {
          if (i !== '1') {
            tableName.push(i.substr(i.length - 2) === '13' ? '小计' : i);
            tableKey.push(i);
          }
        }
        for (let i = 0; i < this.allData[1].length; i++) {
          let temp = {};
          for (let j in this.allData) {
            if (j !== '1') {
              temp[j] = this.allData[j][i].amount;
            }
          }
          tableData.push({
            stateName: this.allData[1][i].stateName,
            feeName: this.allData[1][i].feeName,
            actualArea: this.allData[1][i].actualArea,
            singlePrice: this.allData[1][i].singlePrice,
            amount: this.allData[1][i].amount,
            ...temp
          })
        }
        const name = tableName;
        const key = tableKey;
        this.excel(tableData, name, key, "预算金额表");
      }
    }
  }
</script>

<style scoped lang="less">
  .post {
    position: absolute;
    width: 100%;
    height: 100%;

    .header {
      padding: 15px;
      border-bottom: 1px solid #eff2f7;
    }

    .post-body {
      padding: 15px;

      .table-header {
        padding: 15px 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

      .table {
        overflow: auto;
        display: flex;
        align-items: start;
        font-size: 12px;
        color: #606266;

        .table-row {
          flex: 1;

          .cell {
            padding: 6px 10px;
            height: 29px;
            line-height: 29px;
            border-bottom: 1px solid #EBEEF5;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            .tool-tips {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              color: #FF6C60;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
</style>
