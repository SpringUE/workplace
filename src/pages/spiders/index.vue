<template>
  <d2-container type="full" class="page">
    <d2-grid-layout
      v-bind="layout"
      @layout-updated="layoutUpdatedHandler">
      <d2-grid-item
        v-for="(item, index) in layout.layout"
        :key="index"
        v-bind="item"
        @resize="resizeHandler"
        @move="moveHandler"
        @resized="resizedHandler"
        @moved="movedHandler">
        <el-card shadow="never" class="page_card">
          <div slot="header">
            <el-tag size="mini" type="info">{{cards[index].title}}</el-tag>
            <el-button type="primary" style="float: right;" size="mini"><d2-icon name="play-circle-o"/> 启动</el-button>
          </div>
          <template>
            <div class="charts-inner">
              <ve-line v-if="index == 0" :data="cards[index].data" v-bind="pubSetting"></ve-line>
              <ve-pie v-if="index == 1" :data="cards[index].data" v-bind="pubSetting"></ve-pie>
              <ve-radar v-if="index == 2" :data="cards[index].data" v-bind="pubSetting"></ve-radar>
            </div>
          </template>
        </el-card>
      </d2-grid-item>
    </d2-grid-layout>
  </d2-container>
</template>

<script>
import list from '@/pages/demo/charts/list/_mixin/list.js'

export default {
  mixins: [
    list
  ],
  data () {
    return {
      layout: {
        layout: [
          {'x': 0, 'y': 0, 'w': 12, 'h': 10, 'i': '0'},
          {'x': 0, 'y': 0, 'w': 6, 'h': 10, 'i': '1'},
          {'x': 6, 'y': 0, 'w': 6, 'h': 10, 'i': '2'}
        ],
        colNum: 12,
        rowHeight: 30,
        isDraggable: true,
        isResizable: true,
        isMirrored: false,
        verticalCompact: true,
        margin: [10, 10],
        useCssTransforms: true
      },
      cards: [
        {
          title: '小蜜蜂',
          data: {
            columns: ['日期', '访问用户', '下单用户', '下单率'],
            rows: [
              { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
              { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
              { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
              { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
              { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
              { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
            ]
          }
        },
        {
          title: '投资分析',
          data: {
            columns: ['日期', '访问用户'],
            rows: [
              { '日期': '1/1', '访问用户': 1393 },
              { '日期': '1/2', '访问用户': 3530 },
              { '日期': '1/3', '访问用户': 2923 },
              { '日期': '1/4', '访问用户': 1723 },
              { '日期': '1/5', '访问用户': 3792 },
              { '日期': '1/6', '访问用户': 4593 }
            ]
          }
        },
        {
          title: '职业数据',
          data: {
            columns: ['日期', '访问用户', '下单用户', '下单率'],
            rows: [
              { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
              { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
              { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
              { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
              { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
              { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
            ]
          }
        }
      ]
    }
  },
  mounted () {
    // 加载完成后显示提示
    this.showInfo()
  },
  methods: {
    log (arg1 = 'log', ...logs) {
      if (logs.length === 0) {
        console.log(arg1)
      } else {
        console.group(arg1)
        logs.forEach(e => {
          console.log(e)
        })
        console.groupEnd()
      }
    },
    // 显示提示
    showInfo () {
      this.$notify({
        title: '提示',
        message: '你可以按住卡片拖拽改变位置；或者在每个卡片的右下角拖动，调整卡片大小'
      })
    },
    // 测试代码
    layoutUpdatedHandler (newLayout) {
      console.group('layoutUpdatedHandler')
      newLayout.forEach(e => {
        console.log(`{'x': ${e.x}, 'y': ${e.y}, 'w': ${e.w}, 'h': ${e.h}, 'i': '${e.i}'},`)
      })
      console.groupEnd()
    },
    resizeHandler (i, newH, newW) {
      this.log('resizeHandler', `i: ${i}, newH: ${newH}, newW: ${newW}`)
    },
    moveHandler (i, newX, newY) {
      this.log('moveHandler', `i: ${i}, newX: ${newX}, newY: ${newY}`)
    },
    resizedHandler (i, newH, newW, newHPx, newWPx) {
      this.log('resizedHandler', `i: ${i}, newH: ${newH}, newW: ${newW}, newHPx: ${newHPx}, newWPx: ${newWPx}`)
    },
    movedHandler (i, newX, newY) {
      this.log('movedHandler', `i: ${i}, newX: ${newX}, newY: ${newY}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/style/public.scss';
.page {
  .vue-grid-layout {
    background-color: $color-bg;
    border-radius: 4px;
    margin: -10px;
    .page_card {
      height: 100%;
      @extend %unable-select;
    }
    .vue-resizable-handle {
      opacity: .3;
      &:hover{
        opacity: 1;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.charts-inner {
  height: 300px;
}
</style>
