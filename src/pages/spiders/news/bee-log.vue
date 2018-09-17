<template>
  <div class="bee-logs" :class="{'is-simple': simple}">
    <ul class="items" v-if="simple">
      <li class="item" v-for="(item, index) in data" :key="index">
        <span class="time">[{{format(item.time, 'MM-dd hh:mm')}}]</span>
        <span class="content">{{item.content}}</span>
      </li>
    </ul>
    <el-table v-else :data="data" style="width: 100%">
      <el-table-column type="index" label="序号" width="70">
      </el-table-column>
      <el-table-column prop="content" label="内容">
      </el-table-column>
      <el-table-column prop="time" label="时间" :formatter="timeFormatter">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  props: {
    simple: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      table: {
        columns: [],
        data: [],
        size: "mini",
        stripe: true,
        border: true
      }
    };
  },

  methods: {
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
  },

  created() {
  },

  mounted() {
   
  }
};
</script>

<style lang="scss">

</style>
