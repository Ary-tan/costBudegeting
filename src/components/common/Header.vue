<template>
  <div class="header">
    <div class="header-left">
      <div class="logo">
        <img width="130" src="../../assets/logo.png" alt="">
        <span class="menu" @click="collapseChange">
          <span :class="[collapse ? 'btn': 'on']"></span>
        </span>
      </div>
    </div>
    <div class="header-right">
      <div class="header-user-con">
        <div class="">
          <div class="collapse-btn">
            <span style="font-size: 14px;margin:0 20px 0 25px">{{value ? value : '请选择'}}</span>
            <el-button type="primary" @click.native="dialogSel = true">{{value ? '修改楼栋' : '选择楼栋'}}</el-button>
          </div>
        </div>
        <el-row>
          <el-col :span="12">
            <div class="grid-content">
              <el-dropdown trigger="click" placement="top">
                  <span class="el-dropdown-link">
                    <img src="../../assets/photo.jpg" width="22" height="22"
                         style="vertical-align: middle;border-radius: 50%;margin-right: 5px"> Admin <i
                    class="iconfont icon-stealth"></i>
                  </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>个人设置</el-dropdown-item>
                  <el-dropdown-item>修改头像</el-dropdown-item>
                  <el-dropdown-item divided>退 出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog :modal-append-to-body="true" title="选择楼栋" width="500px" :visible.sync="dialogSel">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
        <el-form-item label="集团公司" prop="company">
          <el-select @change="companyChange" filterable v-model="ruleForm.company" placeholder="请选择公司">
            <el-option
                    v-for="item in companyData"
                    :key="item.projectSysCode"
                    :label="item.projectName"
                    :value="item.projectSysCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="project">
          <el-select @change="projectChange" filterable :disabled="projectName" v-model="ruleForm.project" placeholder="请选择项目">
            <el-option
                    v-for="item in projectData"
                    :key="item.projectSysCode"
                    :label="item.projectName"
                    :value="item.projectSysCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目期数" prop="cycle">
          <el-select @change="cycleChange" :disabled="cycle" filterable v-model="ruleForm.cycle" placeholder="请选择项目期数">
            <el-option
                    v-for="item in cycleData"
                    :key="item.projectSysCode"
                    :label="item.projectName"
                    :value="item.projectSysCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼栋">
          <el-select :disabled="floor" filterable v-model="ruleForm.floor" placeholder="请选择楼栋">
            <el-option
                    v-for="item in floorData"
                    :key="item.projectNo"
                    :label="item.projectName"
                    :value="item.projectNo">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="selSubmit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import bus from "./bus";
  import _api from '../common/httpApi';

  export default {
    data() {
      return {
        dialogSel: false,
        collapse: false,
        projectName: true,
        cycle: true,
        floor: true,
        width: false,
        inputValue: "",
        ruleForm: {
          company: '',
          project: '',
          cycle: '',
          cycleNo: '',
          floor: ''
        },
        rules: {
          company: [{required: true, message: '请选择公司', trigger: 'change'}],
          project: [{required: true, message: '请选择项目', trigger: 'change'}],
          cycle: [{required: true, message: '请选择项目期数', trigger: 'change'}]
        },
        companyData: [],
        projectData: [],
        cycleData: [],
        floorData: [],
        value: '',
        indexes: {
          idxCom: 0,
          idxPro: 0,
          idxProNum: 0,
          floorNum: 0,
          id: 0,
          idxProName: '',
          idxProNumName: '',
          floorNumName: '',
        }
      }
    },
    created() {
      this.getCompany();
    },
    methods: {
      collapseChange() {
        this.collapse = !this.collapse;
        bus.$emit('collapse', this.collapse);
      },
      getCompany() {
        _api.listCompany((res) => {
          if (res.code === 1000) {
            this.companyData = res.data;
            let item = sessionStorage.getItem('mainItem');
            if (item) {
              this.ruleForm = JSON.parse(item);
              this.getProject({
                projectSysCode: this.ruleForm.company,
                level: 3
              }, 0, true);
              this.getProject({
                projectSysCode: this.ruleForm.project,
                level: 4
              }, 1, true);
              this.getProject({
                projectSysCode: this.ruleForm.project,
                level: 5
              }, 2, true);
              this.projectName = false;
              this.cycle = false;
              this.floor = false;
            }
          }
        });
      },
      getProject(params, type, status) {
        _api.listProject(params, (res) => {
          if (res.code === 1000) {
            if (type === 0) {
              this.projectData = res.data
            } else if (type === 1) {
              this.cycleData = res.data;
            } else {
              this.floorData = res.data;
            }
            if (status) this.getValue();
          }
        });
      },
      getValue() {
        this.companyData.forEach(item => {
          if (item.projectSysCode === this.ruleForm.company) this.value = item.projectName + ' > ';
        });
        this.projectData.forEach(item => {
          if (item.projectSysCode === this.ruleForm.project) this.value += item.projectName + ' > ';
        });
        this.cycleData.forEach(item => {
          if (item.projectSysCode === this.ruleForm.cycle) this.value += item.projectName + ' > ';
        });
        if (this.ruleForm.floor) {
          this.floorData.forEach(item => {
            if (item.projectNo === this.ruleForm.floor) this.value += item.projectName;
          });
        } else {
          this.value += '请选择楼栋';
        }
      },
      cancel() {
        let item = sessionStorage.getItem('mainItem');
        this.dialogSel = false;
        if (item) {
          this.ruleForm = JSON.parse(item);
        }
      },
      selSubmit(formName) {
        let prj = this.cycleData.filter(item => {
          if (item.projectSysCode === this.ruleForm.cycle) return item;
        });
        this.ruleForm.cycleNo = prj[0].projectNo;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.getValue();
            sessionStorage.setItem('mainItem', JSON.stringify(this.ruleForm));
            sessionStorage.setItem('index', JSON.stringify(this.indexes));
            this.dialogSel = false;
            bus.$emit('getTemplate');
          } else {
            return false;
          }
        });
      },
      companyChange(val) {
        this.ruleForm.project = '';
        if (val) {
          this.projectName = false;
          this.cycle = true;
          this.floor = true;
          this.getProject({
            projectSysCode: val,
            level: 3
          }, 0, false);
        } else {
          this.projectName = true;
          this.cycle = true;
          this.floor = true;
        }
      },
      projectChange(val) {
        this.ruleForm.cycle = '';
        if (val) {
          this.cycle = false;
          this.floor = true;
          this.getProject({
            projectSysCode: val,
            level: 4
          }, 1, false);
        } else {
          this.cycle = true;
          this.floor = true;
        }
      },
      cycleChange(val) {
        this.ruleForm.floor = '';
        if (val) {
          this.floor = false;
          this.getProject({
            projectSysCode: val,
            level: 5
          }, 2, false);
        } else {
          this.floor = true;
        }
      }
    }
  }
</script>
<style lang="less" type="text/less" scoped>
  .header {
    font-size: @font-16;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f1f2f7;

    .header-left {
      flex: 0 0 210px;
    }

    .header-right {
      flex: 1;
    }
  }

  .header .logo {
    color: #777;
    font-size: 0;
    padding-left: 35px;

    .menu {
      display: inline-block;
      width: 24px;
      height: 24px;
      float: right;
      cursor: pointer;
    }

    .on {
      position: relative;
      top: 14.5px;
      transition: background 0.2s;
      display: inline-block;
      height: 3px;
      width: 24px;
      background: transparent;

      &:before {
        display: block;
        height: 3px;
        width: 24px;
        background: #797979;
        position: relative;
        content: '';
        right: 0;
        transform: translateX(4px) translateY(-3px) rotate(45deg);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        transform-origin: 0 50%;
        transition: transform 0.2s;
        top: -6px;
      }

      &:after {
        position: relative;
        top: 3px;
        content: "";
        display: block;
        height: 3px;
        width: 24px;
        background: #797979;
        backface-visibility: hidden;
        transform-origin: 0 50%;
        transform: translateX(4px) translateY(2px) rotate(-45deg);
        transition: transform 0.2s;
      }
    }

    .btn {
      position: relative;
      top: 14.5px;
      transition: background 0.2s;
      display: inline-block;
      height: 3px;
      width: 24px;
      background: #797979;

      &:before {
        display: block;
        height: 3px;
        width: 24px;
        background: #797979;
        position: relative;
        content: '';
        right: 0;
        transform: translateZ(0);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        transform-origin: 0 50%;
        transition: transform 0.2s;
        top: -6px;
      }

      &:after {
        position: relative;
        top: 3px;
        content: "";
        display: block;
        height: 3px;
        width: 24px;
        background: #797979;
        backface-visibility: hidden;
        transform-origin: 0 50%;
        transform: translateZ(0);
        transition: transform 0.2s;
      }
    }
  }

  .header-user-con {
    color: #777;
    height: 60px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .grid-content {
      width: 275px;
      padding: 19px 20px;
      text-align: right;

      .iconfont {
        font-size: 18px;
        vertical-align: middle;
      }

      .el-icon-bell {
        font-size: 20px;
      }
    }
  }

</style>
