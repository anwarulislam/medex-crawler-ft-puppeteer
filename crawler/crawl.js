const { chromiumPath, chromeConfig } = require('../config/chromePath')
const xl = require('excel4node')
const Brand = require('../model/Brand')

let pharmaAll = [71, 136, 1, 25, 16, 119, 155, 57, 50, 113, 110, 70, 2, 68, 154, 127, 21, 104, 131, 105, 116, 117, 165, 42, 82, 161, 171, 61, 143]
// let pharmaAll = [71, 136, 1, 143]

function makeSinglePharma(pharma_id) {

    const headingColumnNames = [
        "Sl", "Supplier Name", "Product Name", "Product Model", "Category Name", "Sale Price", "Supplier Price",
    ]

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('data');

    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
        ws.cell(1, headingColumnIndex++)
            .string(heading)
    });

    Brand.findAll({
        attributes: ['title', 'pharma_name', 'prices', 'dosage_form', 'strength'],
        where: { pharma_id: pharma_id },
        // limit: 1000
    }).then((data) => {

        let rowIndex = 2;

        let mapped = data.map((d, i) => {

            let prices = d.prices ? JSON.parse(d.prices) : null

            let price = null;

            if (prices && prices.length > 0) {
                price = prices[0].price
            }

            return {
                "SL": `${i + 1}`,
                "Supplier Name": d.pharma_name,
                "Product Name": `${d.title} - ${d.strength} - ${d.dosage_form}`,
                "Product Model": d.dosage_form,
                "Category Name": d.pharma_name,
                "Sale Price": price,
                "Supplier Price": `${price - ((price / 100) * 12)}`
            }
        })

        mapped.forEach(record => {
            let columnIndex = 1;
            Object.keys(record).forEach(columnName => {
                ws.cell(rowIndex, columnIndex++)
                    .string(record[columnName])
            });
            rowIndex++;
        });

        wb.write(`all_pharma/${(mapped[0]['Supplier Name']).replace('.', '')}.xlsx`);
        console.log('done')
    })
}


// makeSinglePharma([5])

pharmaAll.forEach(x => {
    makeSinglePharma([x])
})