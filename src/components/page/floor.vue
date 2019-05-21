<template>
  <div class="floor-box" v-loading="loading">
    <el-row :gutter="20" class="row">
      <el-col :span="6">
        <div class="grid-content">
          <header class="header">公司</header>
          <div @click="changePrj(index, item)" v-for="(item, index) in companyData" :key="index" class="item"
               :class="[indexes.idxCom === index ? 'active' : '']">
            <span>{{item.projectName}}</span>
            <span>{{item.projectCode}}</span>
          </div>
          <div class="item" v-if="companyData.length === 0">
            <span>暂无数据</span>
            <span>--</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <header class="header">项目</header>
          <div @click="changePro(index, item)" v-for="(item, index) in projectData" :key="index" class="item"
               :class="[indexes.idxPro === index ? 'active' : '']">
            <span>{{item.projectName}}</span>
            <span>{{item.projectCode}}</span>
          </div>
          <div class="item" v-if="projectData.length === 0">
            <span>暂无数据</span>
            <span>--</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <header class="header">工程期数</header>
          <div @click="changeProNum(index, item)" v-for="(item, index) in cycleData" :key="index" class="item"
               :class="[indexes.idxProNum === index ? 'active' : '']">
            <span>{{item.projectName}}</span>
            <span>{{item.projectCode}}</span>
          </div>
          <div class="item" v-if="cycleData.length === 0">
            <span>暂无数据</span>
            <span>--</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <header class="header add-title">
            <span>楼栋</span>
            <div>
              <el-button class="floor-add" @click="addFloor"><i class="iconfont icon-add"></i>新 增
              </el-button>
              <el-button class="floor-add" @click="dialog = true"><i class="iconfont icon-keyboard"></i>导
                入
              </el-button>
            </div>
          </header>
          <div @click="changeFloo(index, item)" v-for="(item, index) in floorData" :key="index" class="item"
               :class="[indexes.floorNum === index ? 'active' : '']">
            <span>{{item.projectName}}</span>
            <span>{{item.projectCode}}</span>
            <span class="edit">
              <i class="iconfont icon-editor" @click="changeFloor(item)"></i>
              <i class="iconfont icon-trash" @click="deleteFloor(item)"></i>
            </span>
          </div>
          <div class="item" v-if="floorData.length === 0">
            <span>暂无数据</span>
            <span>--</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      top="10vh"
      :close-on-click-modal="false"
      width="800px"
      :title="title"
      @close="dialogClose('ruleForm')"
      :visible.sync="dialogVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="demo-ruleForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="ruleForm.projectName" placeholder="请输入项目名称"></el-input>
            </el-form-item>
            <el-form-item label="启动时间" prop="startDate">
              <el-date-picker value-format="yyyyMM" format="yyyy 年 MM 月"
                              type="month" placeholder="选择日期"
                              v-model="ruleForm.startDate" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="开盘时间" prop="openDate">
              <el-date-picker :disabled="!ruleForm.startDate" value-format="yyyyMM" format="yyyy 年 MM 月"
                              :picker-options="timeFilter(ruleForm.startDate)" type="month"
                              placeholder="选择日期" v-model="ruleForm.openDate"
                              style="width: 100%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="验收起算日期" prop="acceptingStartDate">
              <el-date-picker :picker-options="timeFilter(ruleForm.openDate)"
                              :disabled="!ruleForm.openDate"
                              type="month" value-format="yyyyMM" format="yyyy 年 MM 月" placeholder="选择日期"
                              v-model="ruleForm.acceptingStartDate" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="验收日期" prop="acceptingDate">
              <el-date-picker :picker-options="timeFilter(ruleForm.acceptingStartDate)"
                              :disabled="!ruleForm.acceptingStartDate" type="month" value-format="yyyyMM"
                              format="yyyy 年 MM 月" placeholder="选择日期"
                              v-model="ruleForm.acceptingDate" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="交房日期" prop="deliveryDate">
              <el-date-picker :picker-options="timeFilter(ruleForm.acceptingDate)"
                              :disabled="!ruleForm.acceptingDate"
                              type="month" value-format="yyyyMM" format="yyyy 年 MM 月" placeholder="选择日期"
                              v-model="ruleForm.deliveryDate" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="建筑面积" prop="buildingArea">
              <el-input v-model="ruleForm.buildingArea" placeholder="请输入大于0的数字"></el-input>
            </el-form-item>
            <el-form-item label="达到销售节点面积（地上）" label-width="200px" prop="saleAboveArea">
              <el-input v-model="ruleForm.saleAboveArea" placeholder="请输入大于0的数字"></el-input>
            </el-form-item>
            <el-form-item label="达到销售节点后剩余面积（地上）" label-width="250px">
              <el-input disabled v-model="ruleForm.afterArea" placeholder="自动计算"></el-input>
            </el-form-item>
            <el-form-item label="层数" prop="floor">
              <el-input v-model="ruleForm.floor" placeholder="请输入正整数"></el-input>
            </el-form-item>
            <el-form-item label="单层面积" required>
              <el-input disabled v-model="ruleForm.singleArea" placeholder="自动计算"></el-input>
            </el-form-item>
            <el-form-item label="人防面积" prop="civilAirArea">
              <el-input v-model="ruleForm.civilAirArea" placeholder="请输入大于0的数字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电梯数量" prop="elevator">
              <el-input v-model="ruleForm.elevator" placeholder="请输入正整数"></el-input>
            </el-form-item>
            <el-form-item label="是否精装" required prop="isFurnished">
              <el-select v-model="ruleForm.isFurnished" placeholder="请选择">
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="ruleForm.isFurnished" label="精装标准" prop="furnStandard">
              <el-input v-model="ruleForm.furnStandard" placeholder="请输入精装标准"></el-input>
            </el-form-item>
            <el-form-item label="实际修建面积" prop="actualArea">
              <el-input v-model="ruleForm.actualArea" placeholder="请输入大于0的数字"></el-input>
            </el-form-item>
            <el-form-item label="业态" prop="formats">
              <el-select v-model="ruleForm.formats" placeholder="请选择">
                <el-option label="别墅" value="1"></el-option>
                <el-option label="多层" value="2"></el-option>
                <el-option label="高层" value="3"></el-option>
                <el-option label="超高层" value="4"></el-option>
                <el-option label="商业" value="5"></el-option>
                <el-option label="地下室" value="6"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="户数" prop="household">
              <el-input v-model="ruleForm.household" placeholder="请输入正整数"></el-input>
            </el-form-item>
            <el-form-item label="达到销售节点（基础面积）" label-width="200px" prop="saleBaseArea">
              <el-input v-model="ruleForm.saleBaseArea" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="可售住宅面积" prop="saleHouseArea">
              <el-input v-model="ruleForm.saleHouseArea" placeholder="请输入大于0的数字"></el-input>
            </el-form-item>
            <el-form-item label="可售商业面积" prop="saleTradeArea">
              <el-input v-model="ruleForm.saleTradeArea" placeholder="请输入大于0的数字"></el-input>
            </el-form-item>
            <el-form-item label="达到销售节点面积（地下）" label-width="200px" prop="saleUnderArea">
              <el-input v-model="ruleForm.saleUnderArea" placeholder="请输入大于0的数字"></el-input>
            </el-form-item>
            <el-form-item label="项目类型" prop="type">
              <el-select v-model="ruleForm.type" placeholder="请选择项目类型">
                <el-option label="住宅" value="1"></el-option>
                <el-option label="商业" value="2"></el-option>
                <el-option label="地下室" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" :loading="btnLoading" @click="submitForm('ruleForm')">确 定</el-button>
          <el-button @click="resetForm('ruleForm')">重 置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      width="500px"
      title="数据导入"
      :visible.sync="dialog">
      <h4>操作提示</h4>
      <p style="padding-top: 10px">1、请先<a style="color: #FF6C60" :href="'http://10.10.200.21:8080/baseProject/downloadTemplate?projectSysCode='+sysCode+''" download="成本指标数据模板">下载Excel模板</a>。</p>
      <p style="padding-top: 10px">2、按要求填写数据并上传。</p>
      <div style="padding-top: 10px">
        <el-upload
          class="upload-demo"
          action="api/baseProject/importProject"
          :data="{projectSysCode: sysCode }"
          :on-success="handleSuccess"
          :limit="1"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">请上传Excel文件</div>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import _api from '../common/httpApi';

  export default {
    name: 'floor',
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        },
        fileList: [],
        edit: false,
        dialog: false,
        title: '',
        dialogVisible: false,
        btnLoading: false,
        loading: false,
        companyData: [],
        projectData: [],
        cycleData: [],
        floorData: [],
        addData: '',
        ruleForm: {
          isFurnished: true,
          projectName: '',
          saleAboveArea: '',
          afterArea: '',
          buildingArea: '',
          floor: ''
        },
        rules: {
          projectName: [{required: true, message: '请输入项目名称', trigger: 'change'}],
          acceptingDate: [{type: 'string', required: true, message: '请选择日期', trigger: 'change'}],
          acceptingStartDate: [{type: 'string', required: true, message: '请选择日期', trigger: 'change'}],
          actualArea: [
            {required: true, message: '请输入参数', trigger: 'change'},
            {type: 'string', pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '请输入正确参数', trigger: 'change'},
          ],
          buildingArea: [
            {required: true, message: '请输入参数', trigger: 'change'},
            {type: 'string', pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '请输入正确参数', trigger: 'change'},
          ],
          civilAirArea: [
            {required: true, message: '请输入参数', trigger: 'change'},
            {type: 'string', pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '请输入正确参数', trigger: 'change'},
          ],
          deliveryDate: [{type: 'string', required: true, message: '请选择日期', trigger: 'change'}],
          elevator: [
            {required: true, message: '请输入参数', trigger: 'change'},
            {type: 'string', pattern: /^[+]{0,1}(\d+)$/, message: '请输入正确参数', trigger: 'change'},
          ],
          floor: [
            {required: true, message: '请输入参数', trigger: 'change'},
            {type: 'string', pattern: /^[+]{0,1}(\d+)$/, message: '请输入正确参数', trigger: 'change'},
          ],
          formats: [{required: true, message: '请选择业态', trigger: 'change'}],
          furnStandard: [{required: true, message: '请输入精装标准', trigger: 'change'}],
          household: [
            {required: true, message: '请输入参数', trigger: 'change'},
            {type: 'string', pattern: /^[+]{0,1}(\d+)$/, message: '请输入正确参数', trigger: 'change'},
          ],
          openDate: [
            {required: true, message: '请输入参数', trigger: 'change'},
            {type: 'string', pattern: /^[+]{0,1}(\d+)$/, message: '请输入正确参数', trigger: 'change'},
          ],
          saleAboveArea: [
            {required: true, message: '请输入参数', trigger: 'change'},
            {type: 'string', pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '请输入正确参数', trigger: 'change'},
          ],
          saleBaseArea: [
            {required: true, message: '请输入参数', trigger: 'change'},
            {type: 'string', pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '请输入正确参数', trigger: 'change'},
          ],
          saleHouseArea: [
            {required: true, message: '请输入参数', trigger: 'change'},
            {type: 'string', pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '请输入正确参数', trigger: 'change'},
          ],
          saleTradeArea: [
            {required: true, message: '请输入参数', trigger: 'change'},
            {type: 'string', pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '请输入正确参数', trigger: 'change'},
          ],
          saleUnderArea: [
            {required: true, message: '请输入参数', trigger: 'change'},
            {type: 'string', pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '请输入正确参数', trigger: 'change'},
          ],
          startDate: [
            {required: true, message: '请输入参数', trigger: 'change'},
            {type: 'string', pattern: /^[+]{0,1}(\d+)$/, message: '请输入正确参数', trigger: 'change'},
          ],
          type: [{required: true, message: '请选择项目类型', trigger: 'change'}]
        },
        indexes: {
          idxCom: 0,
          idxPro: 0,
          idxProNum: 0,
          floorNum: 0,
          id: 0,
          idxProName: '',
          idxProNumName: '',
          floorNumName: '',
        },
        sysCode: ''
      }
    },
    created() {
      this.getCompany();
      let index = sessionStorage.getItem('index');
      if (index) this.indexes = JSON.parse(index);
    },
    beforeDestroy() {
      sessionStorage.setItem('index', JSON.stringify(this.indexes));
    },
    watch: {
      saleAboveArea: function () {
        if (this.ruleForm.saleAboveArea !== '' && this.ruleForm.buildingArea !== '') {
          this.ruleForm.afterArea = (Number(this.ruleForm.buildingArea) - Number(this.ruleForm.saleAboveArea)).toFixed(4);
        }
      },
      buildingArea: function () {
        if (this.ruleForm.saleAboveArea !== '' && this.ruleForm.buildingArea !== '') {
          this.ruleForm.afterArea = (Number(this.ruleForm.buildingArea) - Number(this.ruleForm.saleAboveArea)).toFixed(4);
        }
      },
      ruleForm: {
        handler(newValue) {
          if (this.ruleForm.buildingArea !== '' && this.ruleForm.floor !== '') {
            this.ruleForm.singleArea = (newValue.buildingArea / newValue.floor).toFixed(4);
          }
        },
        deep: true
      }
    },
    computed: {
      saleAboveArea() {
        return this.ruleForm.saleAboveArea;
      },
      buildingArea() {
        return this.ruleForm.buildingArea;
      }
    },
    methods: {
      handleSuccess(res, file, fileList) {
        if (res.code === 1000) {
          this.$message.success('数据导入成功...');
          this.getProject({
            projectSysCode: this.sysCode,
            level: 5
          }, 2)
        } else {
          this.fileList = [];
          this.$message.error(res.msg);
        }
      },
      timeFilter(startTime) {
        if (!startTime) return;
        if (startTime) {
          return {
            disabledDate(time) {
              return time.getTime() < new Date(`${startTime.substr(0, 4)}-${startTime.substr(4, 6)}-01 00:00:00`);
            }
          }
        } else {
          return;
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            if (!this.edit) {
              this.ruleForm.parentProjectCode = this.addData.projectSysCode;
              this.ruleForm.parentProjectNo = this.addData.projectNo;
            }
            let fn = this.edit ? 'changeFloorApi' : 'addFloorApi';
            _api[fn](this.ruleForm, (res) => {
              if (res.code === 1000) {
                this.getProject({
                  projectSysCode: this.addData.projectSysCode,
                  level: 5
                }, 2);
                this.dialogVisible = false;
                this.btnLoading = false;
                this.$message.success(res.msg);
                this.ruleForm = {
                  isFurnished: true
                };
                this.$refs[formName].resetFields();
              } else {
                this.btnLoading = false;
                this.$message.error(res.msg);
              }
            });
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      dialogClose(formName) {
        this.ruleForm = {
          isFurnished: true,
          saleAboveArea: '',
          afterArea: '',
          buildingArea: '',
          floor: ''
        };
        this.$refs[formName].resetFields();
      },
      addFloor() {
        this.edit = false;
        if (this.addData) {
          this.title = '新增楼栋';
          this.dialogVisible = true;
        } else {
          this.$message.warning('请选择工程期数...');
        }
      },
      changeFloor(item) {
        this.edit = true;
        this.title = '修改楼栋';
        this.dialogVisible = true;
        this.$nextTick().then(() => {
          this.ruleForm = JSON.parse(JSON.stringify(item));
          this.$refs['ruleForm'].resetFields();
        });
      },
      deleteFloor(item) {
        this.$confirm('此操作将永久删除该楼栋, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _api.deleteFloorApi({
            no: item.projectNo
          }, (res) => {
            if (res.code === 1000) {
              this.getProject({
                projectSysCode: this.addData ? this.addData.projectSysCode : '',
                level: 5
              }, 2);
              this.indexes.idxCom = 0;
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          });
        }).catch(() => {
        });
      },
      changePrj(index, item) {
        this.loading = true;
        this.indexes.idxCom = index;
        this.indexes.idxPro = 0;
        this.indexes.idxProNum = 0;
        this.indexes.floorNum = 0;
        _api.listProject({
          projectSysCode: item.projectSysCode,
          level: 3
        }, (res) => {
          if (res.code === 1000) {
            this.projectData = res.data;
            if (res.data.length === 0) {
              this.projectData = [];
              this.cycleData = [];
              this.floorData = [];
              this.indexes.id = '';
              this.loading = false;
              return;
            }
            _api.listProject({
              projectSysCode: res.data[this.indexes.idxPro].projectSysCode,
              level: 4
            }, (res) => {
              if (res.code === 1000) {
                if (res.data.length === 0) {
                  this.loading = false;
                  this.cycleData = [];
                  this.floorData = [];
                  this.indexes.id = '';
                  return;
                }
                this.cycleData = res.data;
                this.addData = res.data[0];
                _api.listProject({
                  projectSysCode: res.data[this.indexes.idxProNum].projectSysCode,
                  level: 5
                }, (res) => {
                  if (res.code === 1000) {
                    if (res.data.length === 0) {
                      this.loading = false;
                      this.floorData = [];
                      this.indexes.id = '';
                      return;
                    }
                    this.floorData = res.data;
                    this.indexes.id = res.data[0].projectNo;
                    this.loading = false;
                  } else {
                    this.loading = false;
                  }
                });
              }
            });
          }
        });
      },
      changePro(index, item) {
        this.indexes.idxProName = item.projectName;
        this.loading = true;
        this.indexes.idxPro = index;
        this.indexes.idxProNum = 0;
        this.indexes.floorNum = 0;
        _api.listProject({
          projectSysCode: item.projectSysCode,
          level: 4
        }, (res) => {
          if (res.code === 1000) {
            this.cycleData = res.data;
            this.addData = res.data[0];
            this.sysCode = res.data[0].projectSysCode;
            _api.listProject({
              projectSysCode: res.data[this.indexes.idxProNum].projectSysCode,
              level: 5
            }, (res) => {
              if (res.code === 1000) {
                if (res.data.length === 0) {
                  this.loading = false;
                  this.floorData = [];
                  return;
                }
                this.floorData = res.data;
                this.indexes.id = res.data[0].projectNo;
                this.loading = false;
              } else {
                this.loading = false;
              }
            });
          }
        });
      },
      changeProNum(index, item) {
        this.sysCode = item.projectSysCode;
        this.indexes.idxProNumName = item.projectName;
        this.loading = true;
        this.indexes.idxProNum = index;
        this.indexes.floorNum = 0;
        this.addData = item;
        this.getProject({
          projectSysCode: item.projectSysCode,
          level: 5
        }, 2);
      },
      changeFloo(index, item) {
        this.indexes.floorNumName = item.projectName;
        this.indexes.floorNum = index;
        this.indexes.id = item.projectNo;
      },
      getCompany() {
        this.loading = true;
        _api.listCompany((res) => {
          if (res.code === 1000) {
            this.companyData = res.data;
            _api.listProject({
              projectSysCode: res.data[this.indexes.idxCom].projectSysCode,
              level: 3
            }, (res) => {
              if (res.code === 1000) {
                this.projectData = res.data;
                this.indexes.idxProName = res.data[this.indexes.idxCom].projectName;
                if (res.data.length === 0) {
                  this.projectData = [];
                  this.cycleData = [];
                  this.floorData = [];
                  this.loading = false;
                  return;
                }
                _api.listProject({
                  projectSysCode: res.data[this.indexes.idxPro].projectSysCode,
                  level: 4
                }, (res) => {
                  if (res.code === 1000) {
                    this.cycleData = res.data;
                    this.addData = res.data[0];
                    this.sysCode = res.data[0].projectSysCode;
                    this.indexes.idxProNumName = res.data[this.indexes.idxCom].projectName;
                    if (res.data.length === 0) {
                      this.cycleData = [];
                      this.floorData = [];
                      this.loading = false;
                      return;
                    }
                    sessionStorage.setItem('code', res.data[this.indexes.idxProNum].projectSysCode);
                    _api.listProject({
                      projectSysCode: res.data[this.indexes.idxProNum].projectSysCode,
                      level: 5
                    }, (res) => {
                      if (res.code === 1000) {
                        if (res.data.length === 0) {
                          this.floorData = [];
                          this.loading = false;
                          return;
                        }
                        this.indexes.floorNumName = res.data[this.indexes.idxCom].projectName;
                        this.floorData = res.data;
                        this.indexes.id = res.data[this.indexes.floorNum].projectNo;
                        this.loading = false;
                      } else {
                        this.loading = false;
                      }
                    });
                  }
                });
              }
            });
          }
        });
      },
      getProject(params, type) {
        _api.listProject(params, (res) => {
          if (res.code === 1000) {
            if (res.data.length === 0) {
              this.loading = false;
              this.floorData = [];
              return
            }
            if (type === 0) {
              this.projectData = res.data;
            } else if (type === 1) {
              this.cycleData = res.data;
            } else {
              this.floorData = res.data;
              this.indexes.id = res.data[0].projectNo;
            }
            let timeId = setTimeout(() => {
              this.loading = false;
              clearTimeout(timeId);
            }, 500);
          } else {
            this.loading = false;
          }
        });
        this.dialog = false;
      }
    }
  }
</script>

<style scoped lang="less">
  .floor-box {
    position: absolute;
    width: 100%;
    height: 100%;

    .row {
      width: 100%;
      height: 100%;
      padding: 15px;
      margin: 0 !important;
    }

    .el-col-6 {
      height: 100%;

      .grid-content {
        height: 100%;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.07);
        overflow-y: auto;

        .header {
          padding: 15px;
          border-bottom: 1px solid #eff2f7;

          .floor-add {
            padding: 3.5px 15px;
          }
        }

        .item {
          font-size: 12px;
          cursor: pointer;
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          &:hover {
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.07);
            transition: all .2s ease-in;
          }

          .edit {
            .icon-editor {
              margin-right: 5px;
            }

            .icon-editor:hover {
              color: #FF6C60;
              transition: all .2s ease-in;
            }

            .icon-trash:hover {
              color: #FF6C60;
              transition: all .2s ease-in;
            }
          }
        }

        .active {
          color: #FF6C60;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.07);
        }

        .add-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
  }
</style>