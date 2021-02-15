const puppeteer = require('puppeteer-core');
const os = require('os')

const crawlUrl = 'https://medex.com.bd/companies'

let chromiumPath = '/usr/bin/chromium-browser'

if (os.platform() == 'win32') {
    chromiumPath = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
}

let scrape = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: chromiumPath,
        args: ['--no-sandbox'],
    })
    const page = await browser.newPage();

    await page.goto(crawlUrl, {
        waitUntil: 'networkidle2',
    });

    var results = []; // variable to hold collection of all book titles and prices
    var maxPageNumber = 10; // this is hardcoded last catalogue page, you can set it dunamically if you wish

    results = results.concat(await extractedEvaluateCall(page));

    // this is where next button on page clicked to jump to another page
    while (await page.$('.pagination .page-item:last-child a.page-link')) {

        // call and wait extractedEvaluateCall and concatenate results every iteration.
        // You can use results.push, but will get collection of collections at the end of iteration
        results = results.concat(await extractedEvaluateCall(page));

        await Promise.all([
            page.click('.pagination .page-item:last-child a.page-link'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ]);
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
            data.push({
                name: element.children[0].innerText,
                url: element.children[0].href,
            })
        }

        return data;
    });
}

scrape().then((value) => {
    console.log(value);
    console.log('Collection length: ' + value.length);
    console.log(value[0]);
    console.log(value[value.length - 1]);
});
