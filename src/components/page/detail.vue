<template>
  <div class="post" ref="post">
    <header class="header">形象进度表详情</header>
    <div class="post-body" v-loading="loading">
      <div class="table-box" :style="{height: height + 'px'}">
        <div class="table-thead ary-table">
          <div class="table-row" style="width: 40px">序号</div>
          <div class="table-row" style="width: 50px">编码</div>
          <div class="table-row" style="width: 100px">成本费项</div>
          <div class="table-row" style="width: 100px">费用类别</div>
          <div class="table-row" style="width: 100px">成本科目</div>
          <div class="table-row" style="width: 100px">单位工程</div>
          <div class="table-row" style="width: 100px">工程填写标准</div>
          <div class="table-row" style="width: 150px">标准内容</div>
          <div class="table-row" style="width: 100px">总面积</div>
          <div class="table-row" style="width: 100px">总层数</div>
          <div class="table-row" style="width: 120px">单项总产值（万元）</div>
          <div class="table-row" style="width: 100px">平米指标</div>
          <div class="table-row" style="width: 200px">截止填写节点工程形象描述</div>
          <div class="table-row" style="width: 200px">截止填写节点已完工程形象描述</div>
          <div class="table-col" style="width: 260px" v-for="(item, idx) in index" :key="idx">
            <p class="title">{{item.year + '年' + item.month + '预算（万元）'}}</p>
            <el-row>
              <el-col :span="8">工程填写</el-col>
              <el-col :span="8">完成产值</el-col>
              <el-col :span="8">应付金额</el-col>
            </el-row>
          </div>
        </div>
        <div v-if="tableData.length === 0" style="height: 100px;line-height: 100px;text-align: center">
          暂无数据
        </div>
        <div class="table-tbody ary-table" v-for="(item, index) in tableData">
          <div class="table-row" style="width: 40px">{{index + 1}}</div>
          <div class="table-row" style="width: 50px">{{item.itemCode}}</div>
          <div class="table-row" style="width: 100px">{{item.itemName}}</div>
          <div class="table-row" style="width: 100px">{{item.feeType | feeType}}</div>
          <div class="table-row" style="width: 100px">{{item.costSubject}}</div>
          <div class="table-row" style="width: 100px">{{item.writeStandard}}</div>
          <div class="table-row" style="width: 100px">{{item.standard}}</div>
          <div class="table-row" style="width: 150px">{{writeText(item.writeText)}}</div>
          <div class="table-row" style="width: 100px">{{item.totalArea}}</div>
          <div class="table-row" style="width: 120px">{{item.floor}}</div>
          <div class="table-row" style="width: 100px">{{item.outputValue}}</div>
          <div class="table-row" style="width: 100px">{{item.singlePrice}}</div>
          <div class="table-row" style="width: 200px">{{item.schedule ? item.schedule : '--'}}</div>
          <div class="table-row" style="width: 200px">{{item.cmptSchedule ? item.cmptSchedule : '--'}}</div>
          <div class="table-row" style="width: 260px" v-for="(list, idx) in item.costBudgetMonthDTOList" :key="idx">
            <el-row>
              <el-col :span="8" style="padding-right: 10px">
                {{list.thisQuantities ? list.thisQuantities : '--'}}
              </el-col>
              <el-col :span="8">{{list.thisOutputValue !== null ? list.thisOutputValue : '--'}}</el-col>
              <el-col :span="8">{{list.thisAmount !== null ? list.thisAmount : '--'}}</el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import _api from '../common/httpApi';
  import EditableCell from "./inputModel";
  import bus from '../common/bus';

  export default {
    name: 'post',
    components: {EditableCell},
    data() {
      return {
        dialogVisible: false,
        tableData: [],
        index: [],
        height: 0,
        loading: false
      }
    },
    mounted() {
      let query = this.$route.query;
      if (Object.keys(query).length > 0) {
        this.getTemplate();
      }
      this.$nextTick().then(() => {
        let dom = this.$refs.post;
        this.height = dom.scrollHeight - 67;
      });
    },
    filters: {
      feeType: function (val) {
        switch (val) {
          case 1:
            return '总包施工费';
            break;
          case 2:
            return '分包施工费';
            break;
          case 3:
            return '材设费';
            break;
          case 4:
            return '设备费';
            break;
          default:
            return '';
        }
      }
    },
    methods: {
      writeText(val) {
        switch (parseInt(val)) {
          case 1:
            return '预付、到货';
            break;
          case 2:
            return '预付、到货、安装';
            break;
          case 3:
            return '预付、到货、安装完成';
            break;
          case 4:
            return '预付、到货、验收';
            break;
          case 5:
            return '预付、排产、提货、安装进场、安装完成';
            break;
          case 6:
            return '预付、预留预埋、设备、验收';
            break;
          default:
            return '';
        }
      },
      getTemplate() {
        this.loading = true;
        this.tableData = [];
        _api.listByQueryCmpy(this.$route.query, (res) => {
          if (res.code === 1000) {
            if (res.data === null) {
              this.loading = false;
              return
            }
            this.tableData = res.data;
            this.index = this.tableData[0].costBudgetMonthDTOList;
            let timeId = setTimeout(() => {
              this.loading = false;
              clearTimeout(timeId);
            }, 500);
          }
        });
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

      .table-box {
        position: relative;
        box-sizing: border-box;
        overflow: auto;
        font-size: 12px;
        color: #606266;

        .ary-table {
          display: flex;
          height: 41px;
          align-items: center;

          .table-col {
            padding: 0 10px;
            flex-shrink: 0;
            line-height: 21px;
            border-bottom: 1px solid #EBEEF5;

            .title {
              text-align: center;
            }
          }

          .table-row {
            padding: 6px 10px;
            flex-shrink: 0;
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
            }
          }
        }
      }

      .content-text {
        cursor: pointer;
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
