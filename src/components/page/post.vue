<template>
  <div class="post" ref="post">
    <header class="header">形象进度表</header>
    <div class="post-body" v-loading="loading">
      <div class="table-header">
        <div>
          <el-select @change="versionChange" v-model="value" placeholder="请选择版本">
            <el-option
              v-for="item in versionData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div>
          <el-button size="mini" @click="fold = !fold"><i style="font-size: 12px" class="iconfont icon-label"></i><span
            v-if="fold">折 叠</span><span v-else>展 开</span></el-button>
          <el-button size="mini" @click="dialogVisible = true"><i style="font-size: 12px"
                                                                  class="iconfont icon-search"></i>查 询
          </el-button>
          <el-button size="mini" @click="save"><i style="font-size: 12px" class="iconfont icon-keyboard"></i>保 存
          </el-button>
          <el-button size="mini" @click="submit" :disabled="sub"><i style="font-size: 12px"
                                                                    class="iconfont icon-send"></i>提 交
          </el-button>
          <el-button size="mini" @click="dialog = true"><i style="font-size: 12px" class="iconfont icon-keyboard"></i>导
            入
          </el-button>
        </div>
      </div>
      <!--<el-table v-loading="loading" :row-style="{height: '41px'}" :height="height" :data="tableData" highlight-current-row style="width: 100%">-->
      <!--<el-table-column type="index" label="序号"></el-table-column>-->
      <!--<el-table-column v-if="fold" show-overflow-tooltip prop="itemCode" label="编码"></el-table-column>-->
      <!--<el-table-column v-if="fold" show-overflow-tooltip prop="costFee" label="成本费项"></el-table-column>-->
      <!--<el-table-column v-if="fold" show-overflow-tooltip prop="costSubject" label="成本科目"></el-table-column>-->
      <!--<el-table-column v-if="fold" show-overflow-tooltip prop="cmptSchedule" label="单位工程"></el-table-column>-->
      <!--<el-table-column v-if="fold" prop="writeStandard" width="100" label="工程填写标准"></el-table-column>-->
      <!--<el-table-column v-if="fold" label="总面积" prop="totalArea"></el-table-column>-->
      <!--<el-table-column v-if="fold" label="总层数" prop="floor"></el-table-column>-->
      <!--<el-table-column v-if="fold" width="140" label="单项总产值（万元）" prop="outputValue"></el-table-column>-->
      <!--<el-table-column v-if="fold" width="70" label="平米指标" prop="singlePrice"></el-table-column>-->
      <!--<el-table-column width="200" label="截止填写节点工程形象描述">-->
      <!--<editable-cell-->
      <!--slot-scope="{row}"-->
      <!--:can-edit="edit"-->
      <!--v-model="row.schedule">-->
      <!--<span slot="content" class="content-text">{{row.schedule ? row.schedule : '&#45;&#45;'}}</span>-->
      <!--</editable-cell>-->
      <!--</el-table-column>-->
      <!--<el-table-column width="200" label="截止填写节点已完工程形象描述">-->
      <!--<editable-cell-->
      <!--slot-scope="{row}"-->
      <!--:can-edit="edit"-->
      <!--v-model="row.cmptSchedule">-->
      <!--<span slot="content" class="content-text">{{row.cmptSchedule ? row.cmptSchedule : '&#45;&#45;'}}</span>-->
      <!--</editable-cell>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" :label="(item.year).toString() + '年'" v-for="(item, idx) in index">-->
      <!--<el-table-column align="center" :label="(item.month).toString() + '月'" width="120">-->
      <!--<el-table-column label="工程填写" width="120">-->
      <!--<editable-cell-->
      <!--@addSaveData="addSaveData(item, row)"-->
      <!--slot-scope="{row}"-->
      <!--:can-edit="edit"-->
      <!--v-model="row.costBudgetMonthDTOList[idx].thisQuantities">-->
      <!--<span slot="content" class="content-text">{{row.costBudgetMonthDTOList[idx].thisQuantities ? row.costBudgetMonthDTOList[idx].thisQuantities : '&#45;&#45;'}}</span>-->
      <!--</editable-cell>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="完成产值"></el-table-column>-->
      <!--<el-table-column label="应付金额"></el-table-column>-->
      <!--</el-table-column>-->
      <!--</el-table-column>-->
      <!--</el-table>-->
      <div v-loadmore="loadMore" class="table-box" :style="{height: height + 'px'}">
        <div class="table-thead ary-table">
          <!--<div v-if="fold" class="table-row jp-table_cell_stickyContainer" style="width: 50px">编码</div>-->
          <div v-if="fold" class="table-row jp-table_cell_stickyContainer" style="width: 250px">单位工程</div>
          <!--<div v-if="fold" class="table-row" style="width: 100px">费用类别</div>-->
          <!--<div v-if="fold" class="table-row" style="width: 100px">成本科目</div>-->
          <!--<div v-if="fold" class="table-row" style="width: 100px">单位工程</div>-->
          <div v-if="fold" class="table-row" style="width: 100px">工程填写标准</div>
          <div v-if="fold" class="table-row" style="width: 300px">标准内容</div>
          <div v-if="fold" class="table-row" style="width: 100px">总面积</div>
          <div v-if="fold" class="table-row" style="width: 100px">总层数</div>
          <div v-if="fold" class="table-row" style="width: 120px">单项总产值（万元）</div>
          <div v-if="fold" class="table-row" style="width: 100px">平米指标</div>
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
        <dataTemplate ref="active" @removeClass="removeClass" class="removeClass" :fold="fold"
                      :data="tableData.slice(index * 5, index * 5 + 5)"
                      v-for="(item, index) in dataPage"></dataTemplate>
        <dataTemplate ref="active" @removeClass="removeClass" class="removeClass" :fold="fold"
                      :data="tableData.slice(dataPage * 5)"></dataTemplate>
      </div>
      <el-dialog
        width="700px"
        title="成本指标查询"
        :visible.sync="dialogVisible">
        <el-form :model="searchParams" ref="searchParams" label-width="140px" class="demo-searchParams">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="成本费项">
                <el-input v-model="searchParams.costFee" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="成本科目">
                <el-input v-model="searchParams.costSubject" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="费用类别">
                <el-select v-model="searchParams.feeType" clearable placeholder="请选择">
                  <el-option label="总包施工费" value="1"></el-option>
                  <el-option label="分包施工费" value="2"></el-option>
                  <el-option label="材料费" value="3"></el-option>
                  <el-option label="材料费设备费" value="4"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="业态">
                <el-select v-model="searchParams.format" clearable placeholder="请选择">
                  <el-option label="全" value="1"></el-option>
                  <el-option label="楼" value="2"></el-option>
                  <el-option label="精" value="3"></el-option>
                  <el-option label="地下室" value="4"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目名称">
                <el-input v-model="searchParams.itemName" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="项目类型">
                <el-select v-model="searchParams.itemType" clearable placeholder="请选择">
                  <el-option label="材料" value="1"></el-option>
                  <el-option label="工人" value="2"></el-option>
                  <el-option label="综合" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目编号">
                <el-input disabled v-model="searchParams.projectNo" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" :loading="btnLoading" @click="submitForm">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
        width="500px"
        title="数据导入"
        :visible.sync="dialog">
        <h4>操作提示</h4>
        <p style="padding-top: 10px">1、请先<a style="color: #FF6C60" :href="'http://10.10.200.21:8080/costBudget/downloadTemplate?projectNo='+id+''" download="成本指标数据模板">下载Excel模板</a>。</p>
        <p style="padding-top: 10px">2、按要求填写数据并上传。</p>
        <div style="padding-top: 10px">
          <el-upload
            class="upload-demo"
            action="api/costBudget/importProject"
            :on-success="handleSuccess"
            :limit="1"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">请上传Excel文件</div>
          </el-upload>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import _api from '../common/httpApi';
  import EditableCell from "./inputModel";
  import bus from '../common/bus';
  import dataTemplate from './dataTemplate';

  export default {
    name: 'post',
    components: {EditableCell, dataTemplate},
    data() {
      return {
        fileList: [],
        dialog: false,
        btnLoading: false,
        dialogVisible: false,
        sub: true,
        versionData: [],
        value: '',
        fold: true,
        edit: true,
        currentPage4: 4,
        searchParams: {},
        total: 0,
        tableData: [],
        id: '',
        height: 0,
        loading: false,
        saveData: [],
        index: [],
        loadSign: false,
        dataPage: 0
      }
    },
    mounted() {
      bus.$on('subData', (res, row) => {
        if (this.saveData.length === 0) {
          res.cmptSchedule = row.cmptSchedule;
          res.schedule = row.schedule;
          this.saveData.push(res);
        } else {
          this.saveData.forEach((item, index) => {
            if (res.id === item.id) {
              this.saveData.splice(index, 1);
            }
          });
          res.cmptSchedule = row.cmptSchedule;
          res.schedule = row.schedule;
          this.saveData.push(res);
        }
      });
      let mainItem = JSON.parse(sessionStorage.getItem('mainItem'));
      if (mainItem) {
        this.id = JSON.parse(sessionStorage.getItem('mainItem')).floor;
      }
      bus.$on('getTemplate', () => {
        this.id = JSON.parse(sessionStorage.getItem('mainItem')).floor;
        this.getTemplate();
      });
      this.initialize();
      this.getTemplate();
      this.getVersion();
      this.$nextTick().then(() => {
        let dom = this.$refs.post;
        this.height = dom.scrollHeight - 125;
      });
    },
    beforeDestroy() {
      bus.$off('getTemplate');
      bus.$off('subData');
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
      removeClass() {
        let dom = this.$refs.active;
        dom.forEach(item => {
          item.$data.idx = '';
        })
      },
      handleSuccess(res, file, fileList) {
        if (res.code === 1000) {
          this.$message.success('数据导入成功...');
          this.getTemplate();
          this.dialog = false;
        } else {
          this.fileList = [];
          this.$message.error(res.msg);
        }
      },
      loadMore() {
        if (this.loadSign) {
          this.loading = true;
          this.loadSign = false;
          this.searchParams.current++;
          this.getTemplate();
        }
      },
      numChange(item, list, idx) {
        let ary = [];
        item.forEach(row => {
          if (row !== null || row !== '') ary.push(row.thisQuantities);
        });
        const valued = ary.reduce((num, row) => {
          if (row !== null || row !== '') return Number(num) + Number(row);
        });
        if (valued > list.totalArea) {
          idx.thisQuantities = '';
          this.$message.warning('工程填写面积大于总面积，请从新填写...');
        }
      },
      addSaveData(list, row, idx) {
        if (this.saveData.length === 0) {
          list.cmptSchedule = row.cmptSchedule;
          list.schedule = row.schedule;
          this.saveData.push(list);
        } else {
          this.saveData.forEach((item, index) => {
            if (list.id === item.id) {
              this.saveData.splice(index, 1);
            }
          });
          list.cmptSchedule = row.cmptSchedule;
          list.schedule = row.schedule;
          this.saveData.push(list);
        }
        let lastQuantities = row.costBudgetMonthDTOList[idx - 1] ? row.costBudgetMonthDTOList[idx - 1].thisQuantities : '';
        if (row.writeType === 4) {
          if (row.writeText === '') {
            list.thisQuantities = '';
            this.$message.error('请选择标准内容...');
            return;
          } else {
            _api.getComputationResult({
              id: list.id,
              thisQuantities: list.thisQuantities,
              floor: row.floor,
              chooseType: this.writeText(row.writeText),
              lastQuantities: lastQuantities
            }, (res) => {
              if (res.code === 1000) {
                list.thisOutputValue = res.data.thisOutputValue;
                list.thisAmount = res.data.thisAmount;
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        } else {
          _api.getComputationResult({
            id: list.id,
            thisQuantities: list.thisQuantities,
            floor: row.floor,
            lastQuantities: lastQuantities
          }, (res) => {
            if (res.code === 1000) {
              list.thisOutputValue = res.data.thisOutputValue;
              list.thisAmount = res.data.thisAmount;
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      },
      submitForm() {
        this.getTemplate();
      },
      save() {
        if (this.saveData.length === 0) {
          this.$message.warning('没有需要保存的数据...');
          return
        }
        _api.postIncomeUpdate(this.saveData, (res) => {
          if (res.code === 1000) {
            this.$message.success('保存成功');
            this.sub = false;
            this.saveData = [];
            this.tableData = [];
            this.getTemplate();
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      submit() {
        this.$confirm('提交会生成新版本，当前版本数据不可更改, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _api.postCostCommit({projectNo: this.id}, (res) => {
            if (res.code === 1000) {
              this.sub = true;
              this.getVersion();
              this.$message.success('提交成功');
            } else {
              this.$message.error(res.msg);
            }
          });
        }).catch(() => {
        });
      },
      initialize() {
        // 初始数据
        _api.createCostBudget({projectNo: this.id}, (res) => {
        });
      },
      getTemplate() {
        if (!this.id) {
          this.$message.warning('请选择楼栋信息...');
          return
        }
        this.searchParams.projectNo = this.id;
        this.loading = true;
        this.tableData = [];
        _api.postListByQuery(this.searchParams, (res) => {
          if (res.code === 1000) {
            this.dialogVisible = false;
            if (res.data.length === 0) {
              this.$message.warning('请先维护成本指标表...');
              let timeId = setTimeout(() => {
                this.loading = false;
                clearTimeout(timeId);
              }, 500);
              return;
            }
            res.data.forEach(item => {
              item.writeText = '';
            });
            this.tableData = res.data;
            this.dataPage = parseInt(res.data.length / 5);
            this.index = this.tableData[0].costBudgetMonthDTOList;
            let timeId = setTimeout(() => {
              this.loading = false;
              clearTimeout(timeId);
            }, 500);
            this.loadSign = false;
          }
        });
      },
      getVersion() {
        _api.postCostVersion({projectNo: this.id}, (res) => {
          if (res.code === 1000) {
            this.versionData = [];
            if (res.data.length === 0) return;
            res.data.forEach(item => {
              this.versionData.push({
                value: item.split(' ')[1],
                label: item
              });
            });
            this.versionData.unshift({
              value: false,
              label: '可编辑版本'
            });
          }
        });
      },
      versionChange(val) {
        if (val === false) {
          this.edit = true;
          this.getTemplate();
        } else {
          this.searchParams.version = val;
          this.getTemplate();
          this.edit = false;
        }
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
        justify-content: space-between;
      }

      .table-box {
        position: relative;
        box-sizing: border-box;
        overflow: auto;
        font-size: 12px;
        color: #606266;

        .table-thead {
          float: left;
          position: -webkit-sticky;
          position: sticky;
          top: 0;
          z-index: 2;

          .table-row {
            background: white;
          }
        }

        .ary-table {
          display: flex;
          height: 41px;
          align-items: center;

          .jp-table_cell_stickyContainer {
            padding: 6px 0 !important;
            position: sticky;
            left: 0;
            z-index: 1;
            float: left;

            p {
              background: white;
            }
          }

          .table-col {
            padding: 0 10px;
            flex-shrink: 0;
            line-height: 21px;
            border-bottom: 1px solid #EBEEF5;
            background: white;

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
        border-radius: 4px;
        border: 1px solid transparent;

        &:hover {
          border-radius: 4px;
          border: 1px solid #FF6C60;
          transition: all .4s ease-in;
        }
      }
    }
  }
</style>
