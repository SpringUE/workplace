D2Admin 是一个开源的管理系统前端集成方案，为了方便开发者快速进行管理系统开发而设计

## 仓库和文档

本项目仓库在 Github 和 Gitee 同步发布

[中文文档](http://app.d3collection.cn/d2-admin-doc/lastest/zh/)

**完整版**

[Github 仓库](https://github.com/d2-projects/d2-admin) | 
[码云仓库](https://gitee.com/fairyever/d2-admin) | 
[预览地址](https://fairyever.gitee.io/d2-admin-preview)

**简化版模板**

[Github 仓库](https://github.com/d2-projects/d2-admin-start-kit) | 
[码云仓库](https://gitee.com/fairyever/d2-admin-start-kit) | 
[预览地址](https://fairyever.gitee.io/d2-admin-start-kit-preview)

**飞冰物料**

[D2Admin ICE](https://alibaba.github.io/ice/scaffold?type=vue) | 
[介绍](https://juejin.im/post/5b6349716fb9a04f834669d6) | 
[预览地址](https://fairyever.gitee.io/d2-admin-ice-preview)

因为现在集成了很多的插件和组件，首次加载会占用很多的时间，虽然已经做了首屏加载动画，但还是建议您在发布之前一定要删除没有用到的代码，比如项目没有用到图表、示例、插件组件

<img src="https://raw.githubusercontent.com/FairyEver/d2-admin/master/dev/github/preview@2x.png"/>

## 功能

* 使用 vue-cli3 构建
* 首屏加载等待动画 避免首次加载白屏尴尬
* 简约主题
* 每个插件和组件都配有介绍文档
* 图片资源 sketch 源文件（ 可以在这个文件内重新生成所有图片资源 ）
* 登陆和注销
* 根据路由自动生成菜单
* 可折叠侧边栏
* 方便的菜单设置
* 多国语言支持
* 富文本编辑器
* Markdown 编辑器
* 全屏功能
* Fontawesome 图标库
* 图标选择器（组件）
* 自动引入下载的 SVG 图标
* 前端假数据支持（ mock ）
* 集成蚂蚁金服出品的 G2 图表
* 图表自适应可拖拽大小的卡片容器（示例）
* 简化剪贴板操作
* 时间日期计算工具
* 导入 Excel （ xlsx 格式 + csv 格式 ）
* 数据导出 Excel （ xlsx 格式 + csv 格式 ）
* 数据导出文本
* 数字动画
* 可拖拽调整大小的切分布局
* 可拖拽调整大小和位置的网格布局
* 提供三种方便的页面容器组件（正常卡片，隐形容器，填满页面）
* 代码高亮显示
* 加载并解析（或者直接指定资源） markdown 文件
* GitHub 样式的 markdown 显示组件
* markdown 内代码高亮
* 为 markdown 扩展了百度云链接解析和优化显示
* 右键菜单组件
* 自定义滚动条和滚动控制
* 内置5种主题
* 公用样式抽离，方便的主题定制
* 支持百万级数据量的表格组件
* 打包后随意目录部署（已经做好兼容设置）
* 支持临时菜单配置
* 提供“试验台”功能 方便展示系统功能调用方法 `1.1.4 +`
* 多标签页模式 `1.1.4 +`
* 美化滚动条 `1.1.4 +`
* json view `1.1.4 +`
* cookie 封装 `1.1.5 +`
* 本地持久化存储封装，可根据用户区分存储 `1.1.5 +`
* 多标签页全局控制 API `1.1.5 +`
* 菜单全局控制 API `1.1.5 +`

## 加入小组

D2Admin 是完全开源免费的管理系统集成方案，由 [FairyEver](https://github.com/FairyEver) 在工作之余完全由兴趣驱动完成，如果你也一样喜欢前端开发，欢迎加入我们的讨论/学习群，群内可以`提问答疑`，`分享学习资料`或者随便扯淡

<img src="https://raw.githubusercontent.com/FairyEver/d2-admin/master/dev/github/join@2x.png"/>

## 获取代码

有两种方式可以获得 D2Admin 的代码

* 在 [releases](https://github.com/d2-projects/d2-admin/releases) 页面下载最新的发行版。发行版一般是完成了某个大升级或者修复重要 bug 后发布的压缩包，你可以下载下来直接使用

* Fork 仓库到你的 github 然后克隆到本地，然后使用 master 分支继续你的开发。这种方式得到的是最新的代码，但是会有未完成的新功能。**不建议使用这种方式**

* 由于 github 访问较慢，推荐前往码云仓库下载 [gitee.com/fairyever/d2-admin](https://gitee.com/fairyever/d2-admin)，码云上的仓库**在每次发布版本才会更新**，所以如果你选择此方法，请直接 fork 仓库并克隆到本地

> 码云的仓库由 github 同步，但是发行版和标签同步有一些问题，所以推荐直接 fork 仓库

## 使用

详细用法见 [快速上手](http://app.d3collection.cn/d2-admin-doc/lastest/zh/guide/getting-started.html)

```
// 安装依赖
npm i

// 运行
npm run dev

// 打包
npm run build
```

## 觉得不错 赏个咖啡 让作者打起精神 ~

<img src="https://raw.githubusercontent.com/FairyEver/d2-admin/master/dev/github/reward-me@2x.png"/>

更多介绍和使用方法见 [文档](http://app.d3collection.cn/d2-admin-doc/lastest/zh/)

## 友情链接

* [avue](https://github.com/nmxiaowei/avue)

<img src="https://raw.githubusercontent.com/FairyEver/d2-admin/master/dev/github/give-a-star@2x.png"/>