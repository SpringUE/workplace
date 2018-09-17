<template>
  <div class="bee-editor">
    <el-form ref="form" :model="form" :rules="rules" :inline="true" label-width="100px">
      <h4 class="title">基本配置</h4>
      <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
      </el-form-item>
      <!-- <el-form-item label="群组">
          <el-input v-model="form.group"></el-input>
      </el-form-item> -->
      <el-form-item label="翻页数" prop="pageCount">
          <el-input-number v-model="form.pageCount" controls-position="right" :min="1" :max="10000"></el-input-number>
      </el-form-item>
      <el-form-item label="URL" prop="url">
          <el-input v-model="form.url" style="width:514px;"></el-input>
      </el-form-item>
      <el-form-item label="运行模式">
          <el-checkbox v-model="form.headless" label="headless" name="headless"></el-checkbox>
          <el-checkbox v-model="form.noImage" label="无图模式" name="noImage"></el-checkbox>
          <el-checkbox v-model="form.isAcceptRobot" label="遵循robot" name="isAcceptRobot" :disabled="true"></el-checkbox>
          <el-checkbox v-model="form.redoInError" label="出错重启" name="redoInError" :disabled="true"></el-checkbox>
          <el-checkbox v-model="form.emailInError" label="出错发邮件" name="emailInError" :disabled="true"></el-checkbox>
      </el-form-item>
      <h4 class="title">查询条件</h4>
      <el-form-item label="JSON配置" prop="inputConfigs">
          <el-input type="textarea" v-model="form.inputConfigs" style="width:514px;" :placeholder="inputPlaceholder"></el-input>
      </el-form-item>
      <h4 class="title">采集数据</h4>
      <el-form-item label="JSON配置" prop="outputConfigs">
          <el-input type="textarea" v-model="form.outputConfigs" style="width:514px;"></el-input>
      </el-form-item>
      <h4 class="title">其他设置</h4>
      <el-form-item label="定时任务" prop="taskValue">
          <el-input type="text" v-model="form.taskValue" placeholder="time">
            <el-select v-model="form.taskType" slot="prepend" style="width:76px;" placeholder="Select">
              <el-option label="秒" value="1"></el-option>
              <el-option label="分" value="2"></el-option>
              <el-option label="时" value="3"></el-option>
              <el-option label="天" value="4"></el-option>
              <el-option label="随机" value="5"></el-option>
            </el-select>
          </el-input>
      </el-form-item>
      <el-form-item label="" prop="task">
          <el-checkbox label="开启" v-model="form.task" name="task"></el-checkbox>
      </el-form-item>
    </el-form>
    <!-- 提交 -->
    <div class="action">
        <el-button type="primary" @click="onSubmit('form')">{{isEdit?'确认修改':'立即新增'}}</el-button>
        <el-button @click="onCancle('form')">取消</el-button>
    </div>
  </div>
</template>

<script>
import {pickerOptions} from '@/config.js'

export default {
  props: {
    model: {
      type: String,
      default: () => 'addNew'
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    isEdit() {
      return this.model == 'edit' ? true : false
    }
  },
  data() {
    return {
      flag: {
        loading: false,
      },
      schema: () => {
        return {
          id: "",
          name: "",
          url: "",
          pageCount: "10",
          headless: true,
          noImage: true,
          isAcceptRobot: true,
          redoInError: true,
          emailInError: true,
          inputConfigs: `{}`,
          outputConfigs: '{}',
          task: false,
          taskType: "3",
          taskValue: ''
        }
      },
      inputPlaceholder: `{flows: ['#kw,input,黄金', '#su,click']}`,
      form: {},
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 25, message: '建议长度在 3 到 25 个字符', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入URL', trigger: 'blur' }
        ],
        pageCount: [
          { required: true, message: '请输入翻页数', trigger: 'blur' }
        ],
        inputConfigs: [
          { required: true, message: '请输入查询条件JSON配置', trigger: 'blur' }
        ],
        outputConfigs: [
          { required: true, message: '请输入采集数据JSON配置', trigger: 'blur' }
        ]
      },
      pickerOptions: pickerOptions
    };
  },

  components: {},

  methods: {
    onRreset() {
      this.$refs['form'].resetFields();
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // alert('submit!');
          
          this.$emit('onSubmit', JSON.parse(JSON.stringify(this.form)), this.model)
          this.onRreset()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    onCancle() {
      this.$emit('onCancle')
      this.onRreset()
    },
    filterData() {
      let fields = ['headless', 'noImage', 'isAcceptRobot', 'redoInError', 'emailInError', 'task']

      fields.map(item => {
        this.data[item] = this.data[item] == 1 ? true : false
      })
      
      Object.assign(this.form, this.data)
    },
    init() {
      this.form = this.schema()
      this.isEdit && this.filterData()
    }
  },

  created() {
    this.init()
  },

  mounted() {

  },

  watch: {
    model() {
      this.init()
    },
    data() {
      this.init()
    }
  }
};
</script>

<style lang="scss">
.bee-editor {
  .title {
    margin-top: 0;
  }

  .action {
    text-align: center;
  }
}
</style>
