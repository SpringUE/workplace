<template>
  <d2-container class="bee bee-home">
    <template slot="header">
      
    </template>
    <!-- 底部 -->
    <template slot="footer">
      <!-- 查询条件 -->
      <el-form :inline="true" :model="form" class="spider-form-inline">
        <el-form-item label="名称">
          <el-input class="input-with-select" placeholder="name" v-model="form.name" size="small" style="width:200px;margin-right:10px">
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="关键词">
          <el-input class="input-with-select" placeholder="关键词" v-model="form.keyword" style="width:120px;margin-right:10px">
          </el-input>
        </el-form-item> -->
        <!-- <el-form-item label="URL">
          <el-input class="input-with-select" placeholder="name" v-model="form.url" style="width:150px;margin-right:10px">
          </el-input>
        </el-form-item> -->
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="status" size="small" style="width:110px">
            <el-option label="全部" value=""></el-option>
            <el-option label="已创建" value="0"></el-option>
            <el-option label="已完成" value="1"></el-option>
            <el-option label="进行中" value="2"></el-option>
            <el-option label="定时中" value="3"></el-option>
            <el-option label="已中断" value="4"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="翻页数">
          <el-input v-model="form.pageCount" placeholder="翻页数" size="small" style="width:80px"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="时间">
          <el-date-picker
            v-model="form.createdDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right" size="small">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="onSearch" size="small"><d2-icon name="search"/> 查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="onAddNew" size="small"><d2-icon name="plus-square"/> 新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 分页 -->
      <div class="page">
        <el-pagination background layout="total, sizes, prev, pager, next" 
          :total="page.pageTotal"
          :current-page="page.pageIndex"
          :page-sizes="page.pageSizes"
          :page-size="page.pageSize"
          @size-change="onSizeChange"
          @current-change="onCurrentChange">
        </el-pagination>
      </div>
    </template>
    <!-- 列表 -->
    <div class="bee-list" v-loading="flag.loading">
      <!-- 卡片模式 -->
      <div class="bee-list-card" v-if="viewModel == 'card'">
        <el-row :gutter="14">
          <el-col :span="4" v-for="(item, index) in dataList" :key="index">
            <el-card shadow="never" :body-style="{ padding: '0px' }">
              <div class="view" :class="{'is-active': item.isActive}">
                <!-- <img class="image" src="@/assets/image/hamburger.png"> -->
                <bee-log ref="scrollWrapper" :data="item.logs" :simple="true"></bee-log>
                <div class="action-play">
                  <el-button @click="onStop(item)" circle v-if="item.isActive"><d2-icon class="icon-bee-stop" name="stop"/></el-button>
                  <el-button @click="onGrab(item)" circle v-else><d2-icon class="icon-bee-play" name="play"/></el-button>
                </div>
              </div>
              <div class="info">
                <h5 class="bee-title" :title="item.name">{{ item.name }}</h5>
                <el-row class="bee-infos">
                  <el-col :span="8" class="bee-page-total" :title="item.pageTatal">数据：{{ item.pageTotal}}</el-col> 
                  <el-col :span="6" class="bee-collect-times" :title="item.collectTimes">抓取：{{ item.collectTimes}}</el-col> 
                  <el-col :span="10" class="bee-last-modified-date" :title="item.LastModifiedDate">最近：{{ timeFormatter(null,null,item.LastModifiedDate) }}</el-col>
                </el-row>
                <div class="action-bottom">
                  <el-button @click="onView(item)" type="primary" size="small"><d2-icon name="info-circle"/> 查看</el-button>
                  <el-button @click="onEdit(item)" type="info" size="small"><d2-icon name="cog"/> 设置</el-button>
                </div>
              </div>
              <div class="action-top">
                <el-button class="bee-delete" @click="onDelete(item)" type="danger" plain size="small"><d2-icon name="times"/></el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <!-- 表格模式 -->
      <el-table v-else :data="dataList" border :row-class-name="tableRowClassName" height="560" style="width: 100%">
        <el-table-column prop="name" label="名称" width="150">
        </el-table-column>
        <el-table-column prop="keyword" label="关键词">
        </el-table-column>
        <el-table-column prop="url" label="URL" width="256">
          <template slot-scope="scope">
            <a target="_blank" :href="scope.row.url">{{scope.row.url}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template slot-scope="scope">
            <el-tag size="small">{{statusFormatter(scope.row.url)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pageCount" label="翻页数" width="120" align="center">
        </el-table-column>
        <el-table-column prop="pageTotal" label="数据量" width="120" align="center">
        </el-table-column>
        <el-table-column prop="collectTimes" label="抓取次数" width="120" align="center">
        </el-table-column>
        <el-table-column prop="LastModifiedDate" label="最近抓取时间" width="180" :formatter="timeFormatter" align="center">
        </el-table-column>
        <el-table-column prop="createdDate" label="创建时间" width="180" :formatter="timeFormatter" align="center">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template slot-scope="scope">
            <el-button @click="onStop(scope.row)" type="danger" size="small" v-if="scope.row.isActive">停止</el-button>
            <el-button @click="onGrab(scope.row)" type="primary" size="small" v-else>抓取</el-button>
            <el-button @click="onView(scope.row)" type="info" size="small">查看</el-button>
            <!-- <el-button type="success" size="small"><router-link :to="getViewUrl(scope.row.id)">查看</router-link></el-button> -->
            <el-button @click="onEdit(scope.row)" type="text" size="small">设置</el-button>
            <el-button @click="onDelete(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新建、编辑弹窗 -->
    <el-dialog
      width="760px"
      :title="flag.editorModel == 'addNew' ? '新增小蜜蜂' : '编辑小蜜蜂'"
      :visible.sync="flag.dialogVisible"
      :close-on-click-modal="false"
      :before-close="onBeforeDialogClose">
      <editor ref="editor" :model="flag.editorModel" :data="editRowData" @onSubmit="onSubmit" @onCancle="onCancle"></editor>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="flag.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="flag.dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </d2-container>
</template>

<script>
import io from 'socket.io-client'; // socket.io-client
import {pickerOptions} from '@/config.js'
import editor from './bee-editor.vue'
import beeLog from './bee-log.vue'
import BScroll from 'better-scroll'

export default {
  data() {
    return {
      flag: {
        editorModel: 'addNew',
        loading: false,
        dialogVisible: false
      },
      table: {
        columns: [],
        data: [],
        size: "mini",
        stripe: true,
        border: true
      },
      form: {
        name: "",
        keyword: "",
        url: "",
        status: "",
        pageCount: "",
        createdDate: "",
      },
      socket: null,
      dataList: [],
      viewModel: 'card',
      logs: {},
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageSizes: [10, 20, 30, 50, 100],
        pageTotal: 0
      },
      query: {},
      pickerOptions: pickerOptions,
      editRowData: {},
      BS: null
    };
  },

  components: { editor, beeLog },

  methods: {
    // 新增
    onAddNew() {
      this.flag.editorModel = 'addNew'
      this.flag.dialogVisible = true
    },
    // 查询
    onSearch() {
      this.query = JSON.parse(JSON.stringify(this.form))
      this.page.pageIndex = 1
      this.getBees()
    },
    onSizeChange(size) {
      this.page.pageSize = size
      this.getBees()
    },
    onCurrentChange(curr) {
      this.page.pageIndex = curr
      this.getBees()
    },
    statusFormatter(row, column, cellValue, index) {
      let hash = [
        '已创建',
        '已完成',
        '进行中',
        '定时中',
        '已中断'
      ]
      
      return hash[cellValue] || hash[0];
    },
    timeFormatter(row, column, cellValue, index) {
      if(!cellValue) return '-'
      return this.format(cellValue, "MM-dd hh:mm");
    },
    format(timer, fmt) {
      let date = new Date(Number(timer));

      var hash = {
        yy: ("" + date.getFullYear()).slice(-2), //年
        yyyy: date.getFullYear(), //年
        MM: date.getMonth() + 1, //月份
        dd: date.getDate(), //日
        hh: date.getHours(), //小时
        mm: date.getMinutes(), //分
        ss: date.getSeconds(), //秒
        qq: Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      };

      let result = fmt.replace(/\w+/gi, $0 => {
        return hash[$0];
      });

      return result;
    },
    // 高亮搜索
    filterSearchText(val, field) {
      if(field === '') return val
      let reg = new RegExp(field, 'gi')

      return val.replace(reg, ($0) => {
        return `<em class="search-highline">${$0}</em>`
      })
    },
    onBeforeDialogClose() {
      this.$refs.editor.onCancle()
    },
    // 提交表单
    onSubmit(data, model) {
      console.log(data)
      let done = (res) => {
        this.flag.dialogVisible = false
        // 如果有定时任务
        if (data.task == 1 || data.task == true) {
          this.goTask(data)
        }
      }
      model == 'edit' ? this.editBee(data, done) : this.createBee(data, done)
    },
    // 取消表单
    onCancle() {
      this.flag.dialogVisible = false
      this.editRowData = {} // 重置编辑数据
    },
    // 抓取
    onGrab(row) {
      this.socket.emit('bee.go', row) // 关键代码
      row.isActive = true
    },
    // 停止抓取
    onStop(row) {
      this.socket.emit('bee.stop', row)
      row.isActive = false
    },
    // 查看
    onView(row) {
      let url = `bee-views/${row.id}`
      window.location = window.location.href.replace(/[^\/]+$/, url)
      try {
        window.localStorage.setItem('beeViewItem', JSON.stringify(row))
      } catch (error) {}
    },
    getViewUrl(id) {
      return `bee-views/${id}`
    },
    // 设置
    onEdit(row) {
      this.flag.editorModel = 'edit'
      this.flag.dialogVisible = true
      this.editRowData = row
    },
    // 删除
    onDelete(row) {
      let id = row.id
      let remove = (data, id) => {
        data.forEach((item, index) => {
          if(item.id == id) data.splice(index, 1)
        })
      }
      
      this.$confirm('确定删除么？').then(_ => {
        this.deleteBee(row.id).then(res => {
          remove(this.dataList, id)
        })
      })
    },
    // 查询小蜜蜂列表-服务
    getBees() {
      this.flag.loading = true
      let query = this.query

      query['pageIndex'] = this.page.pageIndex
      query['pageSize'] = this.page.pageSize

      let options = {
        params: query
      }
      
      this.$axios.get('/api/spiders/bee/list', options)
      .then((res) => {
        this.dataList = this.filterDate(res.data)
        this.page.pageTotal = res.page.pageTotal || res.data.length
        this.flag.loading = false
      })
      .catch(err => {
        this.$message.error(`查询失败, ${err.message}`)
      })
    },
    // 过滤数据
    filterDate(data) {
      data.forEach(item => {
        item.logs = item.logs || []
        item.isActive = false
      })

      return data
    },
    // 新建小蜜蜂-服务
    createBee(data, callback) {
      this.$axios.post('/api/spiders/bee/create', data)
      .then((res) => {
        callback && callback(res)
        console.log((res.data));
        this.flag.loading = false
        this.$message.success(`新增成功!`)
        this.getBees() // 更新
      })
      .catch(err => {
        this.$message.error(`新增失败: ${err.message}`)
      })
    },
    // 编辑小蜜蜂-服务
    editBee(data, callback) {
      this.$axios.post('/api/spiders/bee/edit', data)
      .then((res) => {
        callback && callback(res)
        console.log((res.data));
        this.flag.loading = false
        this.$message.success(`修改成功!`)
        this.getBees() // 更新
      })
      .catch(err => {
        this.$message.error(`修改失败, ${err.message}`)
      })
    },
    // 编辑小蜜蜂-服务
    deleteBee(id) {
      return new Promise((resolve, reject) => {
        this.$axios.post('/api/spiders/bee/delete', {id})
        .then((res) => {
          resolve(res)
          console.log((res.data));
          this.flag.loading = false
          this.$message.success(`删除成功!`)
        })
        .catch(err => {
          reject(err)
          this.$message.error(`删除失败: ${err.message}`)
        })
      })
    },
    // 设置日志
    logger(id, message) {
      if(!id) return
      let row = this.dataList.filter(item => {
        return item.id == id
      })
      if(!row.length) return
      else row = row[0]
      if(!row.logs) row.logs = []
      row.logs.unshift({
        time: +new Date(),
        content: message
      })
    },
    tableRowClassName({row, rowIndex}) {
      if (row.isActive) return 'active-row';
      return '';
    },
    goTask(data) {
      // 开启定时任务
      this.socket.emit('bee.goTask', data)
    },
    // 停止
    stop(id) {
      if(!id) return

      this.dataList.forEach(item => {
        if(item.id == id) item.isActive = false
      })
    },
    // 更新信息
    update(id, business, data) {
      if(!id) return

      this.dataList.forEach(item => {
        if(item.id == id && business == 'info') Object.assign(item, data)
      })
    },
    scrollInit(elem) {
      this.BS = new BScroll(elem, {
        mouseWheel: true,
        scrollbar: {
          fade: true,
          interactive: false
        }
      })
    },
  },

  created() {
    this.getBees()
  },

  mounted() {
    // this.scrollInit(this.$refs.scrollWrapper)

    this.socket = window.beeSocket = io('http://localhost:9988');
    // 接收日志
    this.socket.on("bee.log", data => {
      this.logger(data.id, data.message)
    })
    // 停止
    this.socket.on("bee.stop", id => {
      this.stop(id)
    })
    // 更新信息
    this.socket.on("bee.update", res => {
      this.update(res.id, res.business, res.data)
    })

    
  }
};
</script>

<style lang="scss">
.spider-form-inline {
  // margin-bottom: -22px;
  float: left;

  .el-form-item{
    margin-bottom: 0;
  }
}

.bee-home .d2-container-full .d2-container-full__body{
  padding: 0 !important;
}
.bee-home .d2-container-full .d2-container-full__footer{
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

.bee .page{
  float: right;
  margin-top: 0;
}

.bee-list-card{
  padding: 14px;

  .el-card{
    position: relative;
    padding: 0;

    .view{
      position: relative;
      width: 100%;
      height: 230px;
      background: #ddd;

      .action-play{
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 99;
        opacity: 0;
        width: 40px;
        height: 40px;
        // padding: 100px 20px;
        margin: -20px 0 0 -20px;
        text-align: center;
        box-sizing: border-box;
        // background: rgba(0,0,0,.3);
        transition: all .2s;

        .el-button{
          width: 40px;
          height: 40px;
        }

        .icon-bee-play{position: relative; left: 2px;}
      }
      &:hover .action-play{
        opacity: 1;
      }

      .bee-logs{
        position: absolute;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 10px;
        overflow: hidden;

        .items,.item{
          margin: 0; 
          padding: 0;
          list-style: none;
        }
        .item{
          font-size: 12px;
          color: #888;
        }
      }
    }

    .info{
      padding: 14px;
      text-align: center;

      .bee-title{
        margin: 0;
        font-size: 16px;
        font-weight: 400;
        color: #333;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .bee-infos{
        margin: 0;
        margin-top: 10px;
        font-size: 12px;
        text-align: left;
        color: #888;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    .action-top{
      position: absolute;
      right: 0;
      top: -1px;
      opacity: 0;
      transition: all .2s;
    }
    &:hover{
      .action-top{
        opacity: 1;
      }
    }

    .bee-delete{
      width: 18px;
      height: 18px;
      padding: 2px;
      text-align: center;
    }

    .action-bottom{
      margin-top: 10px;
      text-align: center;
    }
  }
}

.bee .el-table .active-row{
  background: #E6A23C;
  color: #fff;

  &:hover{
    background: #E6A23C;
    color: #fff;
  }
}
</style>
