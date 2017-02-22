var request = require("request"),
    cheerio = require("cheerio"),
    fs = require("fs"),

    credentials = require("./credentials.js"),
    parsingModules = require("./parsingModules.js"),

    stringSelector = "div.browse-view",
    tableUrl = credentials.url,

    getContentErrorCounter = 0;

if( !fs.existsSync('Pages') )
  fs.mkdirSync('Pages');

console.log("\n\n\n\n\n\n\n\n  СТАРТ \n\n");

parseTable(1);

function parseTable(pageNumber) {
  parsingModules.getTableParts(tableUrl + pageNumber, stringSelector).then(
    response => {
      if(response.length > 0) {
        getContentErrorCounter = 0;
        parsingModules.savePartsPage(response, './Pages/page-' + pageNumber + '.json');
        if(pageNumber !== 2064){
          pageNumber++;
          parseTable(pageNumber);
        } else {
          console.log("\n\n\n\n\n\n\n\n  ПАРСИНГ ОКОНЧЕН!!! \n\n");
        }
      } else {
        if(getContentErrorCounter < 3) {
          getContentErrorCounter++;
          console.log("Повторно собираем запчасти со страницы " + pageNumber);
          if(getContentErrorCounter < 2) { parseTable(); } else { setTimeout( function () {parseTable()}, 3000); }
        } else {
          console.log("Соединение с сайтом разорвано");
        };
      }
    },
    error => {
      console.log("Ошибка сбора запчастей на странице " + pageNumber);
      if(getContentErrorCounter < 3) {
        getContentErrorCounter++;
        console.log("Повторно собираем запчасти со страницы" + pageNumber);
        if(getContentErrorCounter < 2) { parseTable(); } else { setTimeout( function () {parseTable()}, 3000); }
      } else {
        console.log("Соединение с сайтом разорвано");
      };
    }
  );
}