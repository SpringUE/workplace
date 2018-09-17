<template>
  <d2-container>
    <!-- 表单 -->
    <template slot="header">
      <el-form :inline="true" :model="form" class="spider-form-inline">
        <el-form-item label="关键词">
          <el-input class="input-with-select" placeholder="关键词" v-model="form.keyword" style="width:200px;margin-right:10px">
          </el-input>
        </el-form-item>
        <el-form-item label="搜索引擎">
          <el-select v-model="form.searching" placeholder="搜索引擎" style="width:120px">
            <el-option label="百度" value="1"></el-option>
            <el-option label="Google" value="2"></el-option>
            <el-option label="Bing" value="3"></el-option>
            <el-option label="搜搜soso" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="翻页数">
          <el-input v-model="form.pageCount" placeholder="翻页数" style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="form.noImage">无图模式</el-checkbox>
        </el-form-item>
         <el-form-item label="">
          <el-checkbox v-model="form.headless">headless</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button v-if="!isWorking" type="success" @click="onStart"><d2-icon name="play-circle-o"/> 开始抓取</el-button>
          <el-button v-else type="success" @click="onStop"><d2-icon name="play-circle-o"/> 停止抓取</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="onSocket"><d2-icon name="play-circle-o"/> Socket</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template slot="footer">
      <!-- <d2-link-btn title="D2 CRUD" link="https://github.com/d2-projects"/> -->
    </template>
    <!--
    <div class="d2-mb">
      <el-input class="input-with-select" placeholder="搜索关键词" v-model="keyword" style="width:340px;margin-right:10px">
        <el-select v-model="searching" slot="prepend" placeholder="选择搜索引擎" style="width:80px">
          <el-option label="百度" value="1"></el-option>
          <el-option label="Google" value="2"></el-option>
          <el-option label="Bing" value="3"></el-option>
          <el-option label="搜搜soso" value="4"></el-option>
        </el-select>
      </el-input>
      <el-button type="success" @click="onStart">
        <d2-icon name="play-circle-o"/>
        启动爬虫
      </el-button>
      <el-button type="success" @click="loadData">
        <d2-icon name="play-circle-o"/>
        刷新数据
      </el-button>
    </div>
    -->
    <el-tabs>
      <el-tab-pane>
        <span slot="label"><i class="fa fa-navicon"></i> 抓取结果</span>
        <news-list></news-list>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="fa fa-line-chart"></i> 时间轨迹</span>
        时间轨迹
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="fa fa-bell"></i> 实时日志</span>
        实时日志
      </el-tab-pane>
      <!--
      <el-tab-pane>
        <span slot="label"><i class="fa fa-newspaper-o"></i> 百度风云榜</span>
        <div class="iframe">
          <iframe src="http://top.baidu.com/?vit=1&fr=topbuzz_b1" width="100%" height="600"></iframe>
        </div>
      </el-tab-pane>
      <el-tab-pane label="百度指数">
        <span slot="label"><i class="fa fa-newspaper-o"></i> 百度指数</span>
        <div class="iframe">
          <iframe src="https://index.baidu.com/#/" width="100%" height="600"></iframe>
        </div>
      </el-tab-pane>
      <el-tab-pane label="阿里指数">
        <span slot="label"><i class="fa fa-newspaper-o"></i> 阿里指数</span>
        <div class="iframe">
          <iframe src="https://index.1688.com/" width="100%" height="600"></iframe>
        </div>
      </el-tab-pane>
      <el-tab-pane label="360指数">
        <span slot="label"><i class="fa fa-newspaper-o"></i> 360指数</span>
        <div class="iframe">
          <iframe src="https://trends.so.com/?src=index.so.com" width="100%" height="600"></iframe>
        </div>
      </el-tab-pane>
      -->
    </el-tabs>
  </d2-container>
</template>

<script>
import io from 'socket.io-client'; // socket.io-client
import newsList from './news-list.vue'

export default {
  data () {
    return {
      isWorking: false,
      table: {
        columns: [],
        data: [],
        size: 'mini',
        stripe: true,
        border: true,
      },
      form: {
        keyword: '',
        pageCount: '',
        searching: '1',
        noImage: true,
        headless: false
      },
      socket: null
    }
  },
  components: {newsList},
  methods: {
    // 启动
    onStart () {
      let keyword = this.form.keyword
      let pageCount = this.form.pageCount
      let searching = this.form.searching
      let noImage = this.form.noImage
      let headless = this.form.headless
      
      this.$axios.get('/api/spiders/news/start', {
        params: {keyword, pageCount, searching, noImage, headless}
      })
      .then((res) => {
        console.log((res.data));
        this.isWorking = true
        this.$message.success(res.message)
      })
      .catch(err => {
        this.isWorking = false
        this.$message.error(`启动失败, ${err.message}`)
      })
    },
    // 停止
    onStop () {
      this.$axios.get('/api/spiders/news/stop')
      .then((res) => {
        this.isWorking = false
        this.$message.success(`停止成功，${res.message}`)
      })
      .catch(err => {
        this.$message.error(`停止失败，${err.message}`)
      })
    },
    onSocket() {
      this.socket.emit('join', 'wenzhi') // 关键代码
    },
    // 测试连接
    connectMySQL() {
      this.$axios.get('/api/spiders/conetDB', {
        params: {
          id: 1001
        }
      })
      .then((res) => {
        console.log((res.data));
        
        this.$message.success(res.message)
      })
      .catch(err => {
        this.$message.error(`连接失败, ${err.message}`)
      })
    }
  },
  created() {
  },
  mounted() {
    this.socket = io('http://localhost:9988');

    this.socket.on("spierMessage", data => {
      this.$message.success(`抓取日志：${data}`);
    })
  }
}
</script>

<style lang="scss">
.spider-form-inline{
  margin-bottom: -22px;
}

.iframe > iframe{
  border: none;
}
</style>
