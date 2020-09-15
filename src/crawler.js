const cheerio = require("cheerio");
const axios = require("axios");

exports.GetAllLogsLinks = async function(baseUrl) {
    const body = await axios.get(baseUrl);
    const $ = cheerio.load(body.data);

    const mainTable = $("div[class='ui-widget ui-widget-content ui-corner-all']");
    const pagination = $('.pagination').find('li');
    const lastPageUrl = $(pagination[pagination.length - 1].firstChild).attr('href');

    // Tables with data/url
    const tableList = mainTable.find('tr');
    for (let i = 1; i < tableList.length; i++) {
        console.log("--------------------------------");
        const tableElement = tableList[i].children.filter((element) => element.data != "\n\t\t" && element.data != "\n\t");

        let url = $(tableElement[1].firstChild).attr('href');
        let data = $(tableElement[1].firstChild).text();
        console.log(`${data}, ${url}`);
    }

    console.log(`--------------------------------`);
    console.log(`Ultima pagina eh: ${lastPageUrl}`);
}
