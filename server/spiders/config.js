const config = {
  ChromiumPath: 'C:/Users/Administrator/AppData/Local/Chromium/Application/chrome.exe',
  screenshotPath: 'download/screenshot/',
  songPath: 'download/songs/',
  dataPath: 'download/data/',
  bookPath: 'download/books/',
  launch: {
    // 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
    executablePath: 'C:/Users/Administrator/AppData/Local/Chromium/Application/chrome.exe',
    // 为每个页面设置一致的视口。默认为800x600视口。null禁用默认视口。
    defaultViewport: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1, // < number >指定设备比例因子（可以认为是dpr）。默认为1。
      isMobile: false, // < boolean >是否考虑meta viewport标记。默认为false。
      hasTouch: false, // < boolean >指定viewport是否支持触摸事件。默认为false
      isLandscape: false // < boolean >指定视口是否处于横向模式。默认为false。
    },
    // 设置超时时间
    timeout: 15000,
    // 如果是访问https页面 此属性会忽略https错误
    ignoreHTTPSErrors: true,
    // 打开开发者工具, 当此值为true时, headless总为false
    devtools: false,
    // 关闭headless模式, 不会打开浏览器
    headless: false,
    // 在Ctrl-C上关闭浏览器进程。默认为true。
    handleSIGINT: false
  }
}

module.exports = config
