const cheerio = require("cheerio");
const axios = require("axios");
const moment = require('moment');

// wotlk duration
const minDate = moment("13-11-2008", "DD-MM-YYYY");
const maxDate = moment("12-10-2010", "DD-MM-YYYY");

exports.GetAllLogsLinks = async function (baseUrl) {

    const maxPages = await this.GetAllLogsLinksPerPage(baseUrl);
    for (let i = 2; i < maxPages; ++i)
    {
        await this.GetAllLogsLinksPerPage(baseUrl+`p${i}`);
    }
}

exports.GetAllLogsLinksPerPage = async function(baseUrl) {
    const body = await axios.get(baseUrl);
    const $ = cheerio.load(body.data);

    const mainTable = $("div[class='ui-widget ui-widget-content ui-corner-all']");
    const pagination = $('.pagination').find('li');
    const lastPageUrl = $(pagination[pagination.length - 1].firstChild).attr('href');
    let lastPageIndex = 1;
    if (lastPageUrl.includes('/p'))
        lastPageIndex = lastPageUrl.split('/p')[1].replace('/', '');

    // Tables with data/url
    const tableList = mainTable.find('tr');
    for (let i = 1; i < tableList.length; i++) {
        const tableElement = tableList[i].children.filter((element) => element.data != "\n\t\t" && element.data != "\n\t");

        const url = $(tableElement[1].firstChild).attr('href');
        const date = $(tableElement[1].firstChild).text();
        const dateMoment = moment(date, "DD MMM YYYY");
        const dateString = dateMoment.format('DD-MM-YYYY');

        // check if log is from wotlk
        if (dateMoment.isBefore(minDate) || dateMoment.isAfter(maxDate))
            continue;

        console.log("--------------------------------");
        console.log(`${date}, ${url}, ${dateString}`);
    }

   return lastPageIndex;
}
