<template>
  <div>
    <div @click="activeChange(index)" class="table-tbody ary-table" v-for="(item, index) in tableData" :key="index" :class="[idx === index ? 'active' : '']">
      <!--<div v-if="fold" class="table-row jp-table_cell_stickyContainer" style="width: 50px"><p>{{item.itemCode}}</p></div>-->
      <div v-if="fold" class="table-row jp-table_cell_stickyContainer" style="width: 250px">
        <!--<p :class="[idx === index ? 'active' : '']">{{item.itemName}}</p>-->
        <el-tooltip class="item" effect="dark" :content="item.itemName" placement="top">
          <p :class="[idx === index ? 'active' : '']" class="tool-tips">{{item.itemName}}</p>
        </el-tooltip>
      </div>
      <!--<div v-if="fold" class="table-row" style="width: 100px">{{item.feeType | feeType}}</div>-->
      <!--<div v-if="fold" class="table-row" style="width: 100px">{{item.costSubject}}</div>-->
      <!--<div v-if="fold" class="table-row" style="width: 100px">{{item.itemName}}</div>-->
      <div v-if="fold" class="table-row" style="width: 100px">{{item.writeStandard}}</div>
      <div v-if="fold" class="table-row" style="width: 300px">{{item.standard}}</div>
      <div v-if="fold" class="table-row" style="width: 100px">{{item.totalArea}}</div>
      <div v-if="fold" class="table-row" style="width: 120px">{{item.floor}}</div>
      <div v-if="fold" class="table-row" style="width: 100px">{{item.outputValue}}</div>
      <div v-if="fold" class="table-row" style="width: 100px">{{item.singlePrice}}</div>
      <div class="table-row" style="width: 200px">
        <editable-cell
                :slot-scope="item"
                :can-edit="edit"
                v-model="item.schedule">
          <span slot="content" class="content-text">{{item.schedule ? item.schedule : '--'}}</span>
        </editable-cell>
      </div>
      <div class="table-row" style="width: 200px">
        <editable-cell
                :slot-scope="item"
                :can-edit="edit"
                v-model="item.cmptSchedule">
          <span slot="content" class="content-text">{{item.cmptSchedule ? item.cmptSchedule : '--'}}</span>
        </editable-cell>
      </div>
      <div class="table-row" style="width: 260px" v-for="(list, idx) in item.costBudgetMonthDTOList" :key="idx">
        <el-row>
          <el-col :span="8" style="padding-right: 10px">
            <editable-cell
                    v-if="item.writeType !== 4"
                    @numChange="numChange(item.costBudgetMonthDTOList, list, item, idx)"
                    :slot-scope="item"
                    :can-edit="edit"
                    v-model="list.thisQuantities">
              <span slot="content" class="content-text">{{list.thisQuantities ? list.thisQuantities : '--'}}</span>
            </editable-cell>
            <editable-cell
                    v-else
                    @numChange="numChange(item.costBudgetMonthDTOList, list, item, idx)"
                    :slot-scope="list"
                    editable-component="el-select"
                    :can-edit="edit"
                    close-event="change"
                    v-model="list.chooseType">
              <span slot="content" class="content-text"><span v-if="list.chooseType">{{list.chooseType}}</span><span
                      v-else>请选择</span></span>
              <template slot="edit-component-slot">
                <el-option :label="text" :value="text" v-for="text in textSplit(item.standard)"></el-option>
              </template>
            </editable-cell>
          </el-col>
          <el-col :span="8">{{list.thisOutputValue !== null ? list.thisOutputValue : '--'}}</el-col>
          <el-col :span="8">{{list.thisAmount !== null ? list.thisAmount : '--'}}</el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import EditableCell from "./inputModel";
  import _api from '../common/httpApi';
  import bus from '../common/bus';

  export default {
    name: "dataTemplate",
    props: ['data','fold','index'],
    components: {EditableCell},
    data() {
      return {
        idx: '',
        edit: true,
        tableData: [],
        saveData: []
      }
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
    watch: {
      data(val) {
        this.tableData = val;
      }
    },
    methods: {
      activeChange(index) {
        this.$emit('removeClass');
        this.idx = index;
      },
      textSplit(text){
        return text.split('、')
      },
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
      numChange(item, list, row, idx) {
        let ary = [];
        item.forEach(row => {
          if (row !== null || row !== '') ary.push(row.thisQuantities);
        });
        const valued = ary.reduce((num, row) => {
          if (row !== null || row !== '') return Number(num) + Number(row);
        });
        if (valued > row.totalArea) {
          list.thisQuantities = '';
          list.thisOutputValue = null;
          list.thisAmount = null;
          this.$message.warning('工程填写面积大于总面积，请从新填写...');
        } else {
          bus.$emit('subData', list, row);
          let lastQuantities = row.costBudgetMonthDTOList[idx - 1] ? row.costBudgetMonthDTOList[idx - 1].thisQuantities : '';
          if (row.writeType === 4) {
            if (list.chooseType === '') {
              list.thisQuantities = '';
              this.$message.error('请选择标准内容...');
              return;
            } else {
              _api.getComputationResult({
                id: list.id,
                thisQuantities: list.thisQuantities,
                floor: row.floor,
                chooseType: list.chooseType,
                budgetNo: list.budgetNo
              }, (res) => {
                if (res.code === 1000) {
                  if (res.data.length > 1) {
                    list.thisOutputValue = res.data[0].thisOutputValue;
                    list.thisAmount = res.data[0].thisAmount;
                    item[idx + 1].thisOutputValue = res.data[1].thisOutputValue;
                    item[idx + 1].thisAmount = res.data[1].thisAmount;
                  } else {
                    list.thisOutputValue = res.data[0].thisOutputValue;
                    list.thisAmount = res.data[0].thisAmount;
                  }
                } else {
                  list.thisQuantities = '';
                  this.$message.error(res.msg);
                }
              });
            }
          } else {
            _api.getComputationResult({
              id: list.id,
              thisQuantities: list.thisQuantities,
              floor: row.floor,
              budgetNo: list.budgetNo
            }, (res) => {
              if (res.code === 1000) {
                if (res.data.length > 1) {
                  list.thisOutputValue = res.data[0].thisOutputValue;
                  list.thisAmount = res.data[0].thisAmount;
                  item[idx + 1].thisOutputValue = res.data[1].thisOutputValue;
                  item[idx + 1].thisAmount = res.data[1].thisAmount;
                } else {
                  list.thisOutputValue = res.data[0].thisOutputValue;
                  list.thisAmount = res.data[0].thisAmount;
                }
              } else {
                list.thisQuantities = '';
                this.$message.error(res.msg);
              }
            });
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .content-text {
    cursor: pointer;
    display: inline-block;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    border: 1px solid transparent;
    &:hover {
      border-radius: 4px;
      border: 1px solid #FF6C60 ;
      transition: all .4s ease-in;
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
      float: left;

      p {
        background: white;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
</style>