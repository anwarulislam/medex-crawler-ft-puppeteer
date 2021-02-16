const puppeteer = require('puppeteer-core');
const { chromiumPath, chromeConfig } = require('./config/chromePath')
const Generic = require('./model/Generic')

const crawlUrl = 'https://medex.com.bd/generics/'

var minPage = 1;
var maxPage = 10;

let scrape = async () => {
    const browser = await puppeteer.launch(chromeConfig)
    const page = await browser.newPage();


    await gotoPage(page)

    var results = [];

    results = results.concat(await extractedEvaluateCall(page));

    while (minPage !== maxPage) {
        minPage++
        await Promise.all([
            gotoPage(page),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ]);

        results = results.concat(await extractedEvaluateCall(page));
    }


    browser.close();
    return results;
};

async function gotoPage(page) {
    let p = await page.goto(crawlUrl + minPage, { waitUntil: 'networkidle2', });
    if (p._status == 404) {
        minPage++
        return await gotoPage(page)
    }
    return p
}

async function extractedEvaluateCall(page) {
    // just extracted same exact logic in separate function
    // this function should use async keyword in order to work and take page as argument
    return page.evaluate(() => {

        let title = document.querySelector('.page-heading-1-l').innerText
        let genericData = document.querySelector('.generic-data-container');

        let other_combinations = document.querySelectorAll('.modal-body .row a.hoverable-block');
        let innovators_monograph = document.querySelectorAll('a[target="_blank"].prsinf-child-btn');

        let bn_link;

        if (genericData && genericData.querySelector('.lang-btn')) {
            bn_link = genericData.querySelector('.lang-btn').href
        }

        let headers = genericData.querySelectorAll('.ac-header')
        let details = genericData.querySelectorAll('.ac-body')

        let infoJson = [];
        headers.forEach(function (item, i) {
            infoJson.push({
                title: header.innerText,
                description: (details[i].innerHTML).toString()
            })
        })

        let combinations = []

        if (other_combinations && other_combinations.length > 0) {
            for (var comb of other_combinations) {
                combinations.push({
                    title: comb.innerText,
                    url: comb.href,
                    slug: comb.href.substring(comb.href.lastIndexOf('/') + 1),
                })
            }
        }

        let monograph = []

        if (innovators_monograph && innovators_monograph.length > 0) {
            for (var mon of innovators_monograph) {
                monograph.push({
                    // title: header.innerText,
                    // description: (details[i].innerHTML).toString()
                })
            }
        }

        let url = document.location.origin + document.location.pathname

        let data = {
            title,
            bn_link,
            url,
            slug: url.substring(url.lastIndexOf('/') + 1),
            // description: JSON.stringify(infoJson),
            monograph: JSON.stringify(monograph),
            combinations: JSON.stringify(combinations),
        }

        return data;
    });
}

scrape().then((value) => {
    console.log(value)
    console.log('fetched: ' + value.length);

    // Generic.bulkCreate(value).then((res) => {
    //     console.log('inserted')
    // }).catch((err) => {
    //     console.log(err)
    // })
});
