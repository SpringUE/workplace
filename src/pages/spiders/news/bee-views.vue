<template>
  <d2-container class="bee">
    <!-- <template slot="header"> -->
    <!-- </template> -->
    <!-- 底部 -->
    <!-- <template slot="footer"> -->
    <!-- </template> -->
    <el-tabs>
      <el-tab-pane>
        <span slot="label"><i class="fa fa-navicon"></i> 抓取结果</span>
          <!-- 查询条件 -->
          <!-- <div class="news-query">
            <el-form :inline="true" :model="form">
              <el-form-item label="关键词">
                <el-input class="input-with-select" placeholder="关键词" v-model="form.keyword">
                </el-input>
              </el-form-item>
              <el-form-item label="标题">
                <el-input class="input-with-select" placeholder="标题" v-model="form.title">
                </el-input>
              </el-form-item>
              <el-form-item label="内容">
                <el-input v-model="form.content" placeholder="内容"></el-input>
              </el-form-item>
              <el-form-item label="来源">
                <el-select v-model="form.source" placeholder="搜索引擎" style="width:110px">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="百度" value="baidu"></el-option>
                  <el-option label="Google" value="2"></el-option>
                  <el-option label="Bing" value="3"></el-option>
                  <el-option label="搜搜soso" value="4"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="时间">
                <el-date-picker
                  v-model="form.createdDate"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="onSearch"><d2-icon name="search"/> 查询</el-button>
              </el-form-item>
            </el-form>
          </div> -->
          <!-- 列表 -->
          <div class="new-list" v-loading="flag.loading">
            <el-table :data="newsData" border height="690" style="width: 100%">
              <el-table-column v-for="(item, index) in columns" :prop="item.prop" :label="item.label" width="auto" :key="index">
              </el-table-column>
            </el-table>
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
          </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><d2-icon name="area-chart"/> 统计分析</span>
        统计分析
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="fa fa-line-chart"></i> 时间轨迹</span>
        时间轨迹
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="fa fa-bell"></i> 实时日志</span>
        <bee-log :data="logData"></bee-log>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>
import {pickerOptions} from '@/config.js'
import beeLog from './bee-log.vue'

export default {
  data() {
    return {
      flag: {
        loading: false
      },
      form: {
        keyword: '',
        title: '',
        content: '',
        source: '',
        createdDate: []
      },
      columns: [],
      newsData: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageSizes: [10, 20, 30, 50, 100],
        pageTotal: 0
      },
      query: {},
      pickerOptions: pickerOptions,
      socket: window.beeSocket,
      logData: []
    };
  },

  components: {beeLog},

  methods: {
    getItem() {
      let result = []
      
      // try {
      //   } catch (error) {
      //     result = []
      // }
      let item = this.item = JSON.parse(window.localStorage.getItem('beeViewItem'))
      let columns = JSON.parse(item.outputConfigs).fields

      columns.reduce((curr, next) => {
        let arr = next.split(',')
        curr.push({
          prop: arr[0],
          label: arr[1]
        })
        return curr
      }, result)

      result.push({
        prop: 'createdDate',
        label: '日期'
      })

      return result
    },
    onSearch() {
      this.query = JSON.parse(JSON.stringify(this.form))
      this.page.pageIndex = 1
      this.loadData()
    },
    loadData() {
      this.flag.loading = true

      let {id, dbTableName} = this.item
      let query = this.query

      query['id'] = id
      query['dbTableName'] = dbTableName
      query['pageIndex'] = this.page.pageIndex
      query['pageSize'] = this.page.pageSize

      let options = {
        params: query
      }
      
      this.$axios.get('/api/spiders/bee/schema/list', options)
      .then((res) => {
        console.log((res.data));
        this.newsData = res.data
        this.page.pageTotal = res.page.pageTotal || res.data.length
        this.flag.loading = false
      })
      .catch(err => {
        this.$message.error(`连接失败, ${err.message}`)
      })
    },
    onSizeChange(size) {
      this.page.pageSize = size
      this.loadData()
    },
    onCurrentChange(curr) {
      this.page.pageIndex = curr
      this.loadData()
    },
    timeFormatter(row, column, cellValue, index) {
      // console.log(row, column, cellValue, index);
      return this.format(cellValue, "yyyy-MM-dd hh:mm:ss");
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
    }
  },

  created() {
    this.columns = this.getItem()
    this.loadData()
  },

  mounted() {
     this.socket.on("bee.log", data => {
      // this.setLogData(data)
    })
  },

  filters: {
    
  }
};
</script>

<style scoped lang="scss">
.page{
  float: right;
  margin-top: 10px;
}

.search-highline{
  color: #E6A23C;
  font-style: normal;
}
</style>