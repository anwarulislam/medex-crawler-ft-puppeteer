const puppeteer = require('puppeteer-core');
const { chromiumPath, chromeConfig } = require('../config/chromePath')
const Pharma = require('../model/Pharma')

const crawlUrl = 'https://medex.com.bd/companies'

let scrape = async () => {
    const browser = await puppeteer.launch(chromeConfig)
    const page = await browser.newPage();

    await page.goto(crawlUrl, {
        waitUntil: 'networkidle2',
    });

    var results = []; // variable to hold collection of all book titles and prices
    var maxPageNumber = 10; // this is hardcoded last catalogue page, you can set it dunamically if you wish

    results = results.concat(await extractedEvaluateCall(page));

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
        let elements = document.querySelectorAll('div[class="col-xs-12 data-row-top"]');

        for (var element of elements) {
            var url = element.children[0].href;
            data.push({
                title: element.children[0].innerText,
                url: url,
                slug: url.split('/')[url.split('/').length - 1],
            })
        }

        return data;
    });
}

scrape().then((value) => {
    console.log('fetched: ' + value.length);

    Pharma.bulkCreate(value).then((res) => {
        console.log('inserted')
    }).catch((err) => {
        console.log(err)
    })
});



let pharmaAll = [71, 136, 1, 25, 16, 119, 155, 57, 50, 113, 110, 70, 2, 68, 154, 127, 21, 104, 131, 105, 116, 117, 165, 42, 82, 161, 171, 61, 143]