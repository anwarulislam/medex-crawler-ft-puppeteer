const puppeteer = require('puppeteer-core');
const { chromiumPath, chromeConfig } = require('./config/chromePath')
const Generic = require('./model/Generic')

const crawlUrl = 'https://medex.com.bd/brands/1'

let scrape = async () => {
    const browser = await puppeteer.launch(chromeConfig)
    const page = await browser.newPage();

    await page.goto(crawlUrl, {
        waitUntil: 'networkidle2',
    });

    var results = []; // variable to hold collection of all book titles and prices
    var maxPageNumber = 10; // this is hardcoded last catalogue page, you can set it dunamically if you wish

    results = results.concat(await extractedEvaluateCall(page));
    // results = await extractedEvaluateCall(page);

    // this is where next button on page clicked to jump to another page

    while (await page.$('.pagination .page-item:last-child a.page-link')) {
        await Promise.all([
            page.click('.pagination .page-item:last-child a.page-link'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ]);

        // call and wait extractedEvaluateCall and concatenate results every iteration.
        // You can use results.push, but will get collection of collections at the end of iteration
        results = results.concat(await extractedEvaluateCall(page));
    }


    browser.close();
    return results;
};

async function extractedEvaluateCall(page) {
    // just extracted same exact logic in separate function
    // this function should use async keyword in order to work and take page as argument
    return page.evaluate(() => {
        let data = [];
        let elements = document.querySelectorAll('a.hoverable-block.darker');
        // return elements;
        for (var element of elements) {
            var url = element.href;

            data.push({
                title: element.querySelector('.dcind-title').innerText,
                description: element.querySelector('.dcind').innerText,
                url: url,
                type: 'allopathic',
                slug: url.split('/')[url.split('/').length - 1],
            })
        }

        return data;
    });
}

scrape().then((value) => {
    // console.log(value)
    console.log('fetched: ' + value.length);

    Generic.bulkCreate(value, { ignoreDuplicates: true }).then((res) => {
        console.log('inserted')
    }).catch((err) => {
        console.log(err)
    })
});
