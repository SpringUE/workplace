<template>
  <div class="news">
    <div class="news-query">
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
    </div>
    <div class="new-list" v-loading="flag.loading">
      <el-table :data="newsData" border height="560" style="width: 100%">
        <el-table-column prop="keyword" label="关键词" width="150">
        </el-table-column>
        <el-table-column prop="title" label="标题" width="256">
          <template slot-scope="scope">
            <a target="_blank" :href="scope.row.contentUrl" v-html="filterSearchText(scope.row.title, form.title)"></a>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容">
          <template slot-scope="scope">
            <p v-html="filterSearchText(scope.row.content, form.content)"></p>
          </template>
        </el-table-column>
        <el-table-column prop="source" label="来源" width="120">
        </el-table-column>
        <el-table-column prop="createdDate" label="抓取时间" width="180" :formatter="timeFormatter">
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
  </div>
</template>

<script>
import {pickerOptions} from '@/config.js'

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
      newsData: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageSizes: [10, 20, 30, 50, 100],
        pageTotal: 0
      },
      query: {},
      pickerOptions: pickerOptions
    };
  },
  methods: {
    onSearch() {
      this.query = JSON.parse(JSON.stringify(this.form))
      this.page.pageIndex = 1
      this.loadData()
    },
    loadData() {
      this.flag.loading = true
      let query = this.query

      query['pageIndex'] = this.page.pageIndex
      query['pageSize'] = this.page.pageSize

      let options = {
        params: query
      }
      
      this.$axios.get('/api/spiders/list', options)
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
  filters: {
    
  }
};
</script>

<style lang="scss">
.page{
  float: right;
  margin-top: 10px;
}

.search-highline{
  color: #E6A23C;
  font-style: normal;
}
</style>
