<template>
  <div class="post" ref="post">
    <header class="header">成本指标</header>
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
          <el-button size="mini" @click="fold = !fold"><i style="font-size: 12px" class="iconfont icon-label"></i><span v-if="fold">折 叠</span><span v-else>展 开</span></el-button>
          <el-button size="mini" @click="dialogVisible = true"><i style="font-size: 12px" class="iconfont icon-search"></i>查 询</el-button>
          <el-button size="mini" @click="save"><i style="font-size: 12px" class="iconfont icon-keyboard"></i>保 存</el-button>
          <el-button size="mini" @click="submit" :disabled="sub"><i style="font-size: 12px" class="iconfont icon-send"></i>提 交</el-button>
          <el-button size="mini" @click="dialog = true"><i style="font-size: 12px" class="iconfont icon-keyboard"></i>导 入</el-button>
          <!--<el-dropdown trigger="click" placement="bottom" style="margin-left: 10px">-->
          <!--<el-button>导入/导出<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i></el-button>-->
          <!--<el-dropdown-menu slot="dropdown" style="width: 100px">-->
          <!--<el-dropdown-item @click.native="outputExcel">导出Excel</el-dropdown-item>-->
          <!--<el-dropdown-item divided @click.native="dialog = true">导入数据</el-dropdown-item>-->
          <!--</el-dropdown-menu>-->
          <!--</el-dropdown>-->
        </div>
      </div>
      <div v-loadmore="loadMore" class="table-box" :style="{height: height + 'px'}">
        <div class="table-thead ary-table">
          <div class="table-row" style="width: 40px">序号</div>
          <!--<div v-if="fold" class="table-row" style="width: 60px">业态开放性</div>-->
          <div v-if="fold" class="table-row" style="width: 100px">编码</div>
          <!--<div v-if="fold" class="table-row jp-table_cell_stickyContainer" style="width: 100px">成本费项</div>-->
          <!--<div v-if="fold" class="table-row" style="width: 100px">成本科目</div>-->
          <div class="table-row jp-table_cell_stickyContainer" style="width: 200px">单位工程</div>
          <!--<div v-if="fold" class="table-row" style="width: 100px">费用类别</div>-->
          <!--<div v-if="fold" class="table-row" style="width: 260px">（总包施工费、分包施工费、材设费、设备费）</div>-->
          <div v-if="fold" class="table-row" style="width: 100px">单位</div>
          <div class="table-row" style="width: 100px">计量基数</div>
          <div class="table-row" style="width: 100px">含量系数</div>
          <div class="table-row" style="width: 100px">总工程量</div>
          <div class="table-row" style="width: 100px">单价</div>
          <div class="table-row" style="width: 100px">产值合计(万元)</div>
          <div class="table-row" style="width: 100px">单方</div>
          <div class="table-row" style="width: 100px">支付逻辑</div>
          <div class="table-row" style="width: 100px">支付比例</div>
          <div class="table-row" style="width: 100px">结算款比例</div>
          <div class="table-row" style="width: 120px">结算或质保金起算点</div>
          <div class="table-row" style="width: 100px">结算款后延月数</div>
          <div class="table-row" style="width: 100px">质保金比例</div>
          <div class="table-row" style="width: 100px">质保金后延月数</div>
          <div class="table-row" style="width: 100px">备注</div>
        </div>
        <div v-if="tableData.length === 0" style="height: 100px;line-height: 100px;text-align: center">
          暂无数据
        </div>
        <div @click="idx = index" class="table-tbody ary-table" v-for="(item, index) in tableData" :key="index" :class="[idx === index ? 'active' : '']">
          <div class="table-row" style="width: 40px">{{index + 1}}</div>
          <!--<div v-if="fold" class="table-row" style="width: 60px">{{item.format | openFormat}}</div>-->
          <div v-if="fold" class="table-row" style="width: 100px">{{item.itemCode}}</div>
          <!--<div v-if="fold" class="table-row jp-table_cell_stickyContainer" style="width: 100px"><p>{{item.costFee}}</p></div>-->
          <!--<div v-if="fold" class="table-row" style="width: 100px">{{item.costSubject}}</div>-->
          <div class="table-row jp-table_cell_stickyContainer" style="width: 200px">
            <el-tooltip class="item" effect="dark" :content="item.itemName" placement="top">
              <p :class="[idx === index ? 'active' : '']" class="tool-tips">{{item.itemName}}</p>
            </el-tooltip>
          </div>
          <!--<div v-if="fold" class="table-row" style="width: 100px">{{item.itemType | typeFormat}}</div>-->
          <!--<div v-if="fold" class="table-row" style="width: 260px">{{item.feeType | feeTypeFormat}}</div>-->
          <div v-if="fold" class="table-row" style="width: 100px">
            <span v-if="item.uom === null && item.uom === null && item.uom === null"></span>
            <editable-cell
              v-else
              :slot-scope="item"
              :can-edit="edit"
              @numChange="rowClick(item)"
              v-model="item.uom">
              <span slot="content" class="content-text">{{item.uom ? item.uom : '--'}}</span>
            </editable-cell>
          </div>
          <div class="table-row" style="width: 100px">
            <span v-if="item.parentItemCode === null && item.uom === null && item.uom === null"></span>
            <editable-cell
              v-else
              :slot-scope="item"
              :can-edit="edit"
              @numChange="rowClick(item)"
              v-model="item.measurement">
              <span slot="content" class="content-text">{{item.measurement ? item.measurement : '--'}}</span>
            </editable-cell>
          </div>
          <div class="table-row" style="width: 100px">
            <span v-if="item.parentItemCode === null && item.uom === null"></span>
            <editable-cell
              v-else
              :slot-scope="item"
              :can-edit="edit"
              @numChange="rowClick(item)"
              v-model="item.contentRatio">
              <span slot="content" class="content-text">{{item.contentRatio ? item.contentRatio : '--'}}</span>
            </editable-cell>
          </div>
          <div class="table-row" style="width: 100px">
            <span v-if="item.parentItemCode === null && item.uom === null"></span>
            <span v-else>{{item.quantities = item.measurement * item.contentRatio}}</span>
          </div>
          <div class="table-row" style="width: 100px">
            <span v-if="item.parentItemCode === null && item.uom === null"></span>
            <editable-cell
              v-else
              :slot-scope="item"
              :can-edit="edit"
              @numChange="rowClick(item)"
              v-model="item.price">
              <span slot="content" class="content-text">{{item.price ? item.price : '--'}}</span>
            </editable-cell>
          </div>
          <div class="table-row" style="width: 100px">
            <span v-if="item.parentItemCode === null && item.uom === null"></span>
            <span v-else>{{item.outputValue = item.quantities * item.price / 10000}}</span>
          </div>
          <div class="table-row" style="width: 100px">
            <span v-if="item.parentItemCode === null && item.uom === null"></span>
            <span v-else>{{item.singlePrice = isNaN(item.outputValue / item.measurement * 10000) ? 0 : item.outputValue / item.measurement}}</span>
          </div>
          <div class="table-row" style="width: 100px">
            <span v-if="item.parentItemCode === null && item.uom === null"></span>
            <editable-cell
              v-else
              :slot-scope="item"
              editable-component="el-select"
              :can-edit="edit"
              close-event="change"
              @numChange="rowClick(item)"
              v-model="item.payType">
              <span slot="content"
                    class="content-text">{{item.payType ? item.payType === '1' ? '当月支付' : '下月支付' : '--'}}</span>
              <template slot="edit-component-slot">
                <el-option label="当月支付" value="1"></el-option>
                <el-option label="下月支付" value="2"></el-option>
              </template>
            </editable-cell>
          </div>
          <div class="table-row" style="width: 100px">
            <span v-if="item.parentItemCode === null && item.uom === null"></span>
            <editable-cell
              v-else
              :slot-scope="item"
              :can-edit="edit"
              @numChange="rowClick(item)"
              @addSaveData="addSaveData(item)"
              v-model="item.payRatio">
              <span slot="content" class="content-text">{{item.payRatio ? item.payRatio * 100 + '%' : '--'}}</span>
            </editable-cell>
          </div>
          <div class="table-row" style="width: 100px">
            <span v-if="item.parentItemCode === null && item.uom === null"></span>
            <editable-cell
              v-else
              :slot-scope="item"
              :can-edit="edit"
              @numChange="rowClick(item)"
              @addSaveData="addSaveData(item)"
              v-model="item.settRatio">
              <span slot="content" class="content-text">{{item.settRatio !==null ? item.settRatio * 100 + '%' : '--'}}</span>
            </editable-cell>
          </div>
          <div class="table-row" style="width: 120px">
            <span v-if="item.parentItemCode === null && item.uom === null"></span>
            <editable-cell
              v-else
              :slot-scope="item"
              editable-component="el-select"
              :can-edit="edit"
              close-event="change"
              @numChange="rowClick(item)"
              v-model="item.startCompute">
              <span slot="content" class="content-text">{{item.startCompute | startComputeFilter}}</span>
              <template slot="edit-component-slot">
                <el-option label="工程完工" value="1"></el-option>
                <el-option label="验收" value="2"></el-option>
                <el-option label="交房" value="3"></el-option>
              </template>
            </editable-cell>
          </div>
          <div class="table-row" style="width: 100px">
            <span v-if="item.parentItemCode === null && item.uom === null"></span>
            <editable-cell
              v-else
              :slot-scope="item"
              :can-edit="edit"
              @numChange="rowClick(item)"
              v-model="item.settMonth">
              <span slot="content" class="content-text">{{item.settMonth ? item.settMonth : '--'}}</span>
            </editable-cell>
          </div>
          <div class="table-row" style="width: 100px">
            <span v-if="item.parentItemCode === null && item.uom === null"></span>
            <span v-else>{{item.warrantyRatio !== null ? item.warrantyRatio * 100 + '%' : '--'}}</span>
          </div>
          <div class="table-row" style="width: 100px">
            <span v-if="item.parentItemCode === null && item.uom === null"></span>
            <editable-cell
              v-else
              :slot-scope="item"
              :can-edit="edit"
              @numChange="rowClick(item)"
              v-model="item.warrantyMonth">
              <span slot="content" class="content-text">{{item.warrantyMonth ? item.warrantyMonth : '--'}}</span>
            </editable-cell>
          </div>
          <div class="table-row" style="width: 100px">
            <span v-if="item.parentItemCode === null && item.uom === null"></span>
            <editable-cell
              v-else
              :slot-scope="item"
              :can-edit="edit"
              @numChange="rowClick(item)"
              v-model="item.remark">
              <span slot="content" class="content-text">{{item.remark ? item.remark : '--'}}</span>
            </editable-cell>
          </div>
        </div>
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
                <el-select clearable v-model="searchParams.feeType" placeholder="请选择">
                  <el-option label="总包施工费" value="1"></el-option>
                  <el-option label="分包施工费" value="2"></el-option>
                  <el-option label="材料费" value="3"></el-option>
                  <el-option label="材料费设备费" value="4"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="业态">
                <el-select clearable v-model="searchParams.format" placeholder="请选择">
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
                <el-select clearable v-model="searchParams.itemType" placeholder="请选择">
                  <el-option label="材料" value="1"></el-option>
                  <el-option label="工人" value="2"></el-option>
                  <el-option label="综合" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="支付方式">
                <el-select clearable v-model="searchParams.payType" placeholder="请选择">
                  <el-option label="当月支付" value="1"></el-option>
                  <el-option label="下月支付" value="2"></el-option>
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
        <p style="padding-top: 10px">1、请先<a style="color: #FF6C60" :href="'http://10.10.200.21:8080/costTaskItem/downloadTemplate?projectNo='+id+''" download="成本指标数据模板">下载Excel模板</a>。</p>
        <p style="padding-top: 10px">2、按要求填写数据并上传。</p>
        <div style="padding-top: 10px">
          <el-upload
            class="upload-demo"
            action="api/costTaskItem/importProject"
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
  // import {outputExcel} from "../common/mixins.js";
  import bus from '../common/bus';

  export default {
    name: 'post',
    // mixins: [outputExcel],
    components: {EditableCell},
    data() {
      return {
        fileList: [],
        text: '',
        btnLoading: false,
        dialogVisible: false,
        dialog: false,
        sub: true,
        versionData: [],
        value: '',
        fold: true,
        edit: true,
        currentPage4: 4,
        searchParams: {
          current: 1,
          pageSize: 25
        },
        tableData: [],
        id: '',
        idx: '',
        loadSign: false,
        height: 0,
        loading: false,
        saveData: [],
        session: null
      }
    },
    mounted() {
      let mainItem = JSON.parse(sessionStorage.getItem('mainItem'));
      if (mainItem) {
        this.id = JSON.parse(sessionStorage.getItem('mainItem')).floor;
      }
      bus.$on('getTemplate', () => {
        this.id = JSON.parse(sessionStorage.getItem('mainItem')).floor;
        this.tableData = [];
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
    },
    filters: {
      startComputeFilter: function (val) {
        switch (parseInt(val)) {
          case 1:
            return '工程完工';
            break;
          case 2:
            return '验收';
            break;
          case 3:
            return '交房';
            break;
          default:
            return '--';
        }
      },
      typeFormat: function (val) {
        switch (val) {
          case 1:
            return '材料';
            break;
          case 2:
            return '人工';
            break;
          case 3:
            return '综合';
            break;
          default:
            return '--';
        }
      },
      feeTypeFormat: function (val) {
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
            return '--';
        }
      }
    },
    methods: {
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
      handleChange(file, fileList) {
        this.fileList = fileList.slice(-3);
      },
      // outputExcel() {
      //   let data = JSON.parse(JSON.stringify(this.tableData));
      //   data.forEach(item => {
      //     item.payType ? item.payType === '1' ? item.payType = '当月支付' : item.payType ='下月支付' : item.payType = '';
      //     if (item.startCompute) {
      //       switch (parseInt(item.startCompute)) {
      //         case 1:
      //           item.startCompute = '工程完工';
      //           break;
      //         case 2:
      //           item.startCompute =  '验收';
      //           break;
      //         case 3:
      //           item.startCompute =  '交房';
      //           break;
      //         default:
      //           item.startCompute =  '';
      //       }
      //     }
      //   });
      //   let tableName = ['编码', '单位工程', '（总包施工费、分包施工费、材设费、设备费）', '单位', '计量基数', '含量系数', '总工程量', '单价', '产值合计（万元）', '单方', '支付逻辑', '支付比例', '结算款比例', '结算或质保金起算点', '结算款后延月数', '质保金比例', '质保金延后月数', '备注'];
      //   let tableKey = ['itemCode', 'itemName', 'feeType', 'uom', 'measurement', 'contentRatio', 'quantities', 'price', 'outputValue', 'singlePrice', 'payType', 'payRatio', 'settRatio', 'startCompute', 'settMonth', 'warrantyRatio', 'warrantyMonth', 'remark'];
      //   this.excel(data, tableName, tableKey, "成本指标表");
      // },
      submitForm() {
        this.tableData = [];
        this.getTemplate();
      },
      loadMore() {
        if (this.loadSign) {
          this.loading = true;
          this.loadSign = false;
          this.searchParams.current++;
          this.getTemplate();
        }
      },
      rowClick(row) {
        if (row.measurement && row.contentRatio) {
          if (this.saveData.length === 0) {
            this.saveData.push(row);
          } else {
            this.saveData.forEach((item, index) => {
              if (row.id === item.id) {
                this.saveData.splice(index, 1);
              }
            });
            this.saveData.push(row);
          }
        }
      },
      addSaveData(item) {
        if (item.payRatio > 1) {
          item.payRatio = '';
          this.$message.warning('支付比例必须小于等于1');
        }
        if (item.settRatio > (1 - item.payRatio)) {
          item.settRatio = '';
          this.$message.warning('结算款比例需小于' + (1 - item.payRatio) * 100 + '%');
        }
        item.warrantyRatio = (100 - item.payRatio * 100 - item.settRatio * 100) / 100;
      },
      save() {
        if (this.saveData.length === 0) {
          this.$message.warning('没有需要保存的数据,检查数据是否填写完整...');
          return
        }
        _api.incomeUpdate(this.saveData, (res) => {
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
          _api.costCommit({projectNo: this.id}, (res) => {
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
        _api.createCostTaskItem({projectNo: this.id}, (res) => {
        });
      },
      getTemplate(val) {
        if (!this.id) {
          this.$message.warning('请选择楼栋信息...');
          return
        }
        this.searchParams.projectNo = this.id;
        this.searchParams.version = val ? val : '';
        this.loading = true;
        _api.listByQuery(this.searchParams, (res) => {
          if (res.code === 1000) {
            this.tableData.push(...res.data.records);
            this.dialogVisible = false;
            let timeId = setTimeout(() => {
              this.loading = false;
              clearTimeout(timeId);
            }, 500);
            this.loadSign = true;
            if (res.data.records.length === 0) {
              if (this.searchParams.current === 1) {
                this.$message.warning('请先维护楼栋信息...');
                this.loadSign = false;
              } else {
                this.$message.warning('已加载所有数据...');
                this.loadSign = false;
              }
            }
          }
        });
      },
      getVersion() {
        _api.costVersion({projectNo: this.id}, (res) => {
          if (res.code === 1000) {
            this.versionData = [];
            if (res.data.length === 0) return;
            this.value = 'false';
            res.data.forEach(item => {
              this.versionData.push({
                value: item.split('  ')[1],
                label: item
              });
            });
            this.versionData.unshift({
              value: 'false',
              label: '可编辑版本'
            });
          }
        });
      },
      versionChange(val) {
        if (val === 'false') {
          this.edit = true;
          this.getTemplate();
        } else {
          this.getTemplate(val);
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
        overflow: scroll;
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

        .active {
          background-color: #f5f7fa!important;
        }

        .ary-table {
          float: left;
          display: flex;
          height: 41px;
          align-items: center;
          &:hover {
            background-color: #f5f7fa;
            p {
              background-color: #f5f7fa!important;
            }
          }
          .jp-table_cell_stickyContainer {
            padding: 6px 0 !important;
            position: sticky;
            left: 0;
            z-index: 1;
            p {
              background: white;
            }
          }

          .table-row {
            padding: 6px 10px;
            flex-shrink: 0;
            height: 29px;
            line-height: 29px;
            border-bottom: 1px solid #EBEEF5;
            float: left;

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

      .table-page {
        padding: 15px 0;
        text-align: right;
      }
    }
  }
</style>
