const fs = require('fs');
const config = require('../../config.js');
const puppeteer = require('puppeteer');

// 截图
(async () => {
    const browser = await (puppeteer.launch(config.launch));
    const pages = [
        {
            fileName: 'baidu', url: 'https://www.baidu.com/',
        },
        {
            fileName: 'jianshu', url: 'https://www.jianshu.com/p/a9a55c03f768',
        },
        {
            fileName: 'github', url: 'https://github.com/',
        }
    ]

    console.log(`一共 ${pages.length} 个截图，开始工作...`)
    
    for(var i=0,j=pages.length;i<j;i++) {
        const page = await browser.newPage();
        await page.goto(pages[i].url);
        await page.screenshot({
            path: `${config.screenshotPath}/${pages[i].fileName}.png`,
            type: 'png',
            // quality: 100, 只对jpg有效
            fullPage: true,
            // 指定区域截图，clip和fullPage两者只能设置一个
            // clip: {
            //   x: 0,
            //   y: 0,
            //   width: 1000,
            //   height: 40
            // }
        });
        console.log(`完成 ${pages[i].fileName} ，${i+1}/${j}`)

        page.close()
    }

    console.log(`done successfuly`)
    browser.close();
})()
