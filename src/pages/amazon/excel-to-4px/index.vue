<template>
  <d2-container>
    <!-- <template slot="header">amazon订单to-4px订单</template> -->
    <div class="d2-mb">
      <el-upload :before-upload="get4pxOrderData" action="default">
        <el-button type="success">
          <d2-icon name="file-o"/>
          选择文件
        </el-button>
      </el-upload>
    </div>
    <el-table v-bind="table" height="640" :border="true">
      <el-table-column
        v-for="(item, index) in table.columns"
        :key="index"
        :prop="item.prop"
        :width="item.width"
        :label="item.label">
      </el-table-column>
    </el-table>
  </d2-container>
</template>

<script>
import {columns} from './table.js'
import get4pxTable from './table.js'

export default {
  data () {
    return {
      table: {
        columns: columns || [],
        data: [],
        size: 'mini',
        stripe: true,
        border: true
      }
    }
  },
  methods: {
    // 转换4PX表格
    get4pxOrderData (file) {
      this.$import.xlsx(file)
        .then(({header, results}) => {
          let tableData = get4pxTable(results);

          this.table = tableData;
          console.log(tableData)
          this.exportExcel();
        })
      return false
    },
    exportExcel () {
      this.$export.excel({
        columns: this.table.columns,
        data: this.table.data
      })
        .then(() => {
          this.$message.success('导出表格成功')
        })
    }
  }
}
</script>

<style lang="scss">
  .el-table .el-table__header th, 
  .el-table .el-table__header tr{
    background-color: #e6e6e6;
  }
  .el-table--border,
  .el-table td, .el-table th.is-leaf,
  .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
    border-color: #dddddd
  }
</style>
