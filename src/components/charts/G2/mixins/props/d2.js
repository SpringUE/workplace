export default {
  // 图表数据 此 data 非 官方文档中的 data
  data: {
    type: Array,
    required: false,
    default: () => []
  },
  // 高度 开启自动填充父元素 (非G2自带)
  autoHeight: {
    type: Boolean,
    required: false,
    default: true
  },
  // 在组件 mounted 后自动初始化图表 (非G2自带)
  autoInit: {
    type: Boolean,
    required: false,
    default: false
  },
  // 在组件 mounted 后自动初始化图表的 延时 (非G2自带)
  autoInitDelay: {
    type: Number,
    required: false,
    default: 0
  }
}
