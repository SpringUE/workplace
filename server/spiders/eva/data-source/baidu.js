var fs = require("fs");

// 搜索源
const source = 'baidu'

// 路径
const url = 'https://www.baidu.com'

// 搜索输入框,选择器
const inputSelectName = '#kw'

// 搜索按钮,选择器
const submitSelectName = '#su'

// 页面内容,选择器
const domSelectName = '.c-container'

// 下一页,选择器
const nextPageSelectName = '#page > a:last-child'

// 翻页数量
// const needPageMaxNum = 20

module.exports = async (options, browser, timeout, key, needPageMaxNum) => {
  require('./template/search-engine.js')(
    options, browser, timeout, key,
    source, url, inputSelectName, submitSelectName, domSelectName,
    nextPageSelectName, needPageMaxNum
  )
}