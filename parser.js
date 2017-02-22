var request = require("request"),
    cheerio = require("cheerio"),

    credentials = require("./credentials.js"),
    parsingModules = require("./parsingModules.js"),

    //stringSelector = "div.row.odd",
    stringSelector = "div.browse-view",
    tableUrl = credentials.url;

console.log("\n\n\n\n\n\n\n\n  СТАРТ \n\n");

parseTable();

function parseTable() {
  parsingModules.getTableParts(tableUrl, stringSelector);
}