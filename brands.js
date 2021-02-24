const cliProgress = require('cli-progress');
const puppeteer = require('puppeteer-core');
const { chromiumPath, chromeConfig } = require('./config/chromePath')
const Brand = require('./model/Brand')

const crawlUrl = 'https://medex.com.bd/brands/'

var minPage = 1;
var maxPage = 5;

// create a new progress bar instance and use shades_classic theme
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
// start the progress bar with a total value of 200 and start value of 0
bar1.start(maxPage, minPage);

let scrape = async () => {
    const browser = await puppeteer.launch(chromeConfig)
    const page = await browser.newPage();


    await gotoPage(page)

    // var results = [];

    // console.log(await extractedEvaluateCall(page))
    
    // let res = await store(await extractedEvaluateCall(page));
    
    while ((minPage !== maxPage) && (minPage <= (maxPage + 1))) {
        minPage++
        
        // update the current value in your application..
        bar1.update(minPage);
        
        await Promise.all([
            gotoPage(page),
            page.waitForNavigation({ waitUntil: 'load' }),
        ]);
        
        // console.log(await extractedEvaluateCall(page))
        await store(await extractedEvaluateCall(page));

        // results = results.concat(await extractedEvaluateCall(page));
    }

    if (minPage == maxPage) {
        bar1.stop()
    }


    browser.close();
    return true;
};

async function gotoPage(page) {
    let p = await page.goto(crawlUrl + minPage, { waitUntil: 'load', timeout: 0 });
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

        let brandHeader = document.querySelector('.brand-header')

        let title = brandHeader.querySelector('span[style]')
        let dosage_form = brandHeader.querySelector('.h1-subtitle')

        let pharma_name = brandHeader.querySelector('.calm-link')
        let pharma_url = brandHeader.querySelector('.calm-link')
        let pharma_slug = pharma_url ? pharma_url.href.substring(pharma_url.href.lastIndexOf('/') + 1) : null

        let generic_name = brandHeader.querySelector('div[title="Generic Name"]')
        let generic_url = brandHeader.querySelector('div[title="Generic Name"] a')
        let generic_slug = generic_url ? generic_url.href.substring(generic_url.href.lastIndexOf('/') + 1) : null

        let strength = brandHeader.querySelector('div[title="Strength"]')

        let genericData = document.querySelector('.generic-data-container');

        let price_combinations = document.querySelectorAll('.packages-wrapper .package-container');
        let other_combinations = document.querySelectorAll('.cbtn.btn-sibling-brands');
        let innovators_monograph = document.querySelectorAll('a[target="_blank"].btn-teal');

        let bn_link;

        if (genericData && genericData.querySelector('.lang-btn')) {
            bn_link = genericData.querySelector('.lang-btn').href
        }

        let headers = genericData.querySelectorAll('.ac-header')
        let details = genericData.querySelectorAll('.ac-body')

        let infoJson = [];
        headers.forEach(function (header, i) {
            infoJson.push({
                title: header ? header.innerText : null,
                description: (details[i].innerHTML).toString()
            })
        })

        let combinations = []

        if (other_combinations && other_combinations.length > 0) {
            for (var comb of other_combinations) {
                combinations.push({
                    title: comb.firstChild.textContent.trim(),
                    dosage_form: comb.querySelector('.sdfsa').innerText,
                    url: comb.href,
                    slug: (comb.href.substring(comb.href.lastIndexOf('/') + 1)).split('?')[0]
                })
            }
        }

        let prices = []

        if (price_combinations && price_combinations.length > 0) {
            for (var price of price_combinations) {
                let pack = price.querySelector('span.pack-size-info');
                prices.push({
                    unit_name: price.firstChild.textContent.split('৳')[0].trim(),
                    price: price.firstChild.textContent.split('৳')[1].trim(),
                    pack: pack ? pack.innerText.split('৳')[0].trim() : null,
                    pack_price: pack ? pack.innerText.split('৳')[1].trim() : null,
                })
            }
        }

        let monograph = []

        if (innovators_monograph && innovators_monograph.length > 0) {
            for (var mon of innovators_monograph) {
                monograph.push({
                    title: mon.innerText,
                    url: mon.href
                })
            }
        }

        let url = document.location.origin + document.location.pathname

        let data = {
            title: title.firstChild.textContent.trim(),
            dosage_form: dosage_form ? dosage_form.innerText : null,
            description: infoJson.length ? JSON.stringify(infoJson) : null,
            bn_link,
            url,

            pharma_name: pharma_name ? pharma_name.innerText : null,
            pharma_url: pharma_url ? pharma_url.href : null,
            pharma_slug,

            generic_name: generic_name ? generic_name.innerText : null,
            generic_url: generic_url ? generic_url.href : null,
            generic_slug,

            strength: strength ? strength.innerText : null,
            slug: url.substring(url.lastIndexOf('/') + 1),
            type: 'allopathic',
            monograph: monograph.length ? JSON.stringify(monograph) : null,
            combinations: combinations.length ? JSON.stringify(combinations) : null,
            prices: prices.length ? JSON.stringify(prices) : null,
        }

        return data;
    });
}

scrape().then((value) => {
    // console.log(value)
    console.log('fetched: ' + value.length + '\n');


});


async function store(value) {

    let res = await Brand.create(value);
    // stop the progress bar

    if (res) {
        console.log('\n inserted')
    } else {
        console.error('error')
    }

    return true
}


// UPDATE generics main, old_generics old
// SET    main.type = old.type
// WHERE  main.slug = old.slug
// AND    main.type <> old.type;